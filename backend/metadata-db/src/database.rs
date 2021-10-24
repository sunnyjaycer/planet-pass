use crate::{
    error::DatabaseError,
    prelude::{CategoryAttribute, Id, IdState, IdStates, Metadata},
};
use sled::transaction::ConflictableTransactionError::{self, Abort};
use sled::{transaction::TransactionalTree, Transactional};
use std::iter::repeat;

/// Wrapper over the sled database.
#[derive(Debug)]
pub struct Database {
    db: sled::Db,
    planets: sled::Tree,
    inverted: sled::Tree,
}

impl Database {
    /// Create a new Database wrapper.
    pub fn new(db: sled::Db) -> Result<Self, DatabaseError> {
        Ok(Self {
            planets: db.open_tree("planets")?,
            inverted: db.open_tree("inverted")?,
            db,
        })
    }

    /// Add a piece of metadata to the database, given a key (ID + state).
    /// Returns the previous entry, if any.
    pub fn add_metadata(
        &self,
        id_state: IdState,
        metadata: Metadata,
    ) -> Result<Option<Metadata>, DatabaseError> {
        Ok((&self.planets, &self.inverted).transaction(
            |(tx_planets, tx_inverted): &(TransactionalTree, TransactionalTree)| {
                // First, find existing entries
                let existing_metadata = tx_planets
                    .get(&bincode::serialize(&id_state).map_err(DatabaseError::from)?)?
                    .map(|v| bincode::deserialize::<Metadata>(&v))
                    .transpose()
                    .map_err(DatabaseError::from)?
                    .unwrap_or_default();

                // Delete existing inverted index entries
                // Note: This is less efficient than finding the set difference and selectively removing them, but I literally can't be bothered.
                for (attribute, category) in existing_metadata
                    .into_inner()
                    .into_iter()
                    .flat_map(|(cat, attribs)| attribs.into_iter().zip(repeat(cat)))
                {
                    Database::update_inverted(tx_inverted, &(category, attribute).into(), |set| {
                        set.remove(&id_state)
                    })?;
                }

                // Write inverted index
                for (attribute, category) in (*metadata)
                    .clone()
                    .into_iter()
                    .flat_map(|(cat, attribs)| attribs.into_iter().zip(repeat(cat)))
                {
                    Database::update_inverted(tx_inverted, &(category, attribute).into(), |set| {
                        set.insert(id_state)
                    })?;
                }

                // Write new metadata
                tx_planets
                    .insert(
                        bincode::serialize(&id_state).map_err(DatabaseError::from)?,
                        bincode::serialize(&metadata).map_err(DatabaseError::from)?,
                    )?
                    .map(|v| bincode::deserialize(&v))
                    .transpose()
                    .map_err(|e| Abort(DatabaseError::from(e)))
            },
        )?)
    }

    /// Gets a piece of metadata, given a key (ID + state).
    pub fn get_metadata(&self, id_state: IdState) -> Result<Option<Metadata>, DatabaseError> {
        Ok(self
            .planets
            .get(bincode::serialize(&id_state)?)?
            .map(|v| bincode::deserialize(&v))
            .transpose()?)
    }

    /// Gets all metadata for a given ID.
    /// Returns `None` if no such planet ID exists.
    pub fn get_all_metadata(&self, planet: Id) -> Result<Option<Vec<Metadata>>, DatabaseError> {
        let mut metadatas = Vec::new();

        for kv in self.planets.scan_prefix(bincode::serialize(&planet)?) {
            let (_, v) = kv?;
            let v = bincode::deserialize(&v)?;
            metadatas.push(v);
        }

        Ok((!metadatas.is_empty()).then(|| metadatas))
    }

    /// Removes a given key.
    /// Returns the metadata before removal, if any.
    pub fn remove_metadata(&self, id_state: IdState) -> Result<Option<Metadata>, DatabaseError> {
        Ok((&self.planets, &self.inverted).transaction(
            |(tx_planets, tx_inverted): &(TransactionalTree, TransactionalTree)| {
                // Fetch metadata
                let metadata = tx_planets
                    .remove(bincode::serialize(&id_state).map_err(DatabaseError::from)?)?
                    .map(|v| bincode::deserialize::<Metadata>(&v))
                    .transpose()
                    .map_err(DatabaseError::from)?;

                // Update inverted index
                if let Some(metadata) = &metadata {
                    for (attribute, category) in (**metadata)
                        .clone()
                        .into_iter()
                        .flat_map(|(cat, attribs)| attribs.into_iter().zip(repeat(cat)))
                    {
                        Database::update_inverted(
                            tx_inverted,
                            &(category, attribute).into(),
                            |set| set.remove(&id_state),
                        )?;
                    }
                }
                Ok(metadata)
            },
        )?)
    }

    /// Returns whether a key exists
    pub fn contains(&self, id_state: IdState) -> Result<bool, DatabaseError> {
        Ok(self.planets.contains_key(bincode::serialize(&id_state)?)?)
    }

    /// Returns whether a planet ID exists
    pub fn contains_planet(&self, planet: Id) -> Result<bool, DatabaseError> {
        Ok(self
            .planets
            .scan_prefix(bincode::serialize(&planet)?)
            .count()
            != 0)
    }

    /// Provide inner access to the database.
    /// Using this function voids your warranty.
    pub fn into_inner(&self) -> &sled::Db {
        &self.db
    }

    /// Update an entry in the inverted index.
    fn update_inverted<F, T>(
        transactional_tree: &TransactionalTree,
        category_attribute: &CategoryAttribute,
        mut f: F,
    ) -> Result<T, ConflictableTransactionError<DatabaseError>>
    where
        F: FnMut(&mut IdStates) -> T,
    {
        // Fetch set from inverted index
        let mut set = transactional_tree
            .get(bincode::serialize(category_attribute).map_err(DatabaseError::from)?)?
            .map(|v| bincode::deserialize::<IdStates>(&v))
            .transpose()
            .map_err(DatabaseError::from)?
            .unwrap_or_default();

        // Perform op
        let r = f(&mut set);

        // Write-back
        transactional_tree.insert(
            bincode::serialize(&category_attribute).map_err(DatabaseError::from)?,
            bincode::serialize(&set).map_err(DatabaseError::from)?,
        )?;

        Ok(r)
    }
}
