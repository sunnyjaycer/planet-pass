use crate::{
    error::DatabaseError,
    prelude::{DatabaseKey, Id, Metadata},
};

/// Wrapper over the sled database.
#[derive(Debug)]
pub struct Database {
    db: sled::Db,
}

impl Database {
    /// Create a new Database wrapper.
    pub fn new(db: sled::Db) -> Self {
        Self { db }
    }

    /// Add a piece of metadata to the database, given a key (ID + state).
    /// Returns the previous entry, if any.
    pub fn add_metadata(
        &self,
        key: DatabaseKey,
        metadata: Metadata,
    ) -> Result<Option<Metadata>, DatabaseError> {
        Ok(self
            .db
            .insert(bincode::serialize(&key)?, bincode::serialize(&metadata)?)?
            .map(|v| bincode::deserialize(&v))
            .transpose()?)
    }

    /// Gets a piece of metadata, given a key (ID + state).
    pub fn get_metadata(&self, key: DatabaseKey) -> Result<Option<Metadata>, DatabaseError> {
        Ok(self
            .db
            .get(bincode::serialize(&key)?)?
            .map(|v| bincode::deserialize(&v))
            .transpose()?)
    }

    /// Gets all metadata for a given ID.
    /// Returns `None` if no such planet ID exists.
    pub fn get_all_metadata(&self, planet: Id) -> Result<Option<Vec<Metadata>>, DatabaseError> {
        let mut metadatas = Vec::new();

        for kv in self.db.scan_prefix(bincode::serialize(&planet)?) {
            let (_, v) = kv?;
            let v = bincode::deserialize(&v)?;
            metadatas.push(v);
        }

        Ok((!metadatas.is_empty()).then(|| metadatas))
    }

    /// Removes a given ID.
    pub fn remove_metadata(&self, key: DatabaseKey) -> Result<Option<Metadata>, DatabaseError> {
        Ok(self
            .db
            .remove(bincode::serialize(&key)?)?
            .map(|v| bincode::deserialize(&v))
            .transpose()?)
    }

    /// Returns whether a key exists
    pub fn contains(&self, key: DatabaseKey) -> Result<bool, DatabaseError> {
        Ok(self.db.contains_key(bincode::serialize(&key)?)?)
    }

    /// Returns whether a planet ID exists
    pub fn contains_planet(&self, planet: Id) -> Result<bool, DatabaseError> {
        Ok(self.db.scan_prefix(bincode::serialize(&planet)?).count() != 0)
    }

    /// Provide inner access to the database.
    /// Using this function voids your warranty.
    pub fn into_inner(&self) -> &sled::Db {
        &self.db
    }
}
