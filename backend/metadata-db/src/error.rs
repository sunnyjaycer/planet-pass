use sled::transaction::{ConflictableTransactionError, TransactionError};
use thiserror::Error;

/// Errors encountered when interacting with the database.
#[derive(Error, Debug)]
pub enum DatabaseError {
    #[error("sled database error")]
    Sled(#[from] sled::Error),
    #[error("(de)serialization error")]
    Bincode(#[from] bincode::Error),
}

impl From<TransactionError<DatabaseError>> for DatabaseError {
    fn from(txe: TransactionError<DatabaseError>) -> Self {
        match txe {
            TransactionError::Abort(a) => a,
            TransactionError::Storage(s) => DatabaseError::Sled(s),
        }
    }
}

impl From<DatabaseError> for ConflictableTransactionError<DatabaseError> {
    fn from(dbe: DatabaseError) -> Self {
        Self::Abort(dbe)
    }
}
