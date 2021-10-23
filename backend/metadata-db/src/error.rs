use thiserror::Error;

/// Errors encountered when interacting with the database.
#[derive(Error, Debug)]
pub enum DatabaseError {
    #[error("sled database error")]
    Sled(#[from] sled::Error),
    #[error("(de)serialization error")]
    Bincode(#[from] bincode::Error),
}
