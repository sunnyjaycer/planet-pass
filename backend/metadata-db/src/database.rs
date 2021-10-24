use crate::{
    error::DatabaseError,
    prelude::{Id, IdState, Metadata},
};

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
        Ok(self
            .planets
            .insert(
                bincode::serialize(&id_state)?,
                bincode::serialize(&metadata)?,
            )?
            .map(|v| bincode::deserialize(&v))
            .transpose()?)
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

    /// Removes a given ID.
    pub fn remove_metadata(&self, id_state: IdState) -> Result<Option<Metadata>, DatabaseError> {
        Ok(self
            .planets
            .remove(bincode::serialize(&id_state)?)?
            .map(|v| bincode::deserialize(&v))
            .transpose()?)
    }

    /// Returns whether a key exists
    pub fn contains(&self, id_state: IdState) -> Result<bool, DatabaseError> {
        Ok(self.planets.contains_key(bincode::serialize(&id_state)?)?)
    }

    /// Returns whether a planet ID exists
    pub fn contains_planet(&self, planet: Id) -> Result<bool, DatabaseError> {
        Ok(self.planets.scan_prefix(bincode::serialize(&planet)?).count() != 0)
    }

    /// Provide inner access to the database.
    /// Using this function voids your warranty.
    pub fn into_inner(&self) -> &sled::Db {
        &self.db
    }
}
