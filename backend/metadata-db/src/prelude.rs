use serde::{Deserialize, Serialize};
use std::{
    collections::{HashMap, HashSet},
    ops::Deref,
};

/// The token ID of a Planet.
#[derive(Clone, Copy, Debug, Serialize, Deserialize, PartialEq, Eq)]
pub struct Id(u32);

/// The state of a Planet.
#[derive(Clone, Copy, Debug, Serialize, Deserialize, Default, PartialEq, Eq)]
pub struct State(u32);

/// The key for the database, comprising of the ID and the State.
#[derive(Clone, Copy, Debug, Serialize, Deserialize, PartialEq, Eq)]
pub struct DatabaseKey(Id, State);

impl From<(Id, State)> for DatabaseKey {
    fn from((id, state): (Id, State)) -> Self {
        Self(id, state)
    }
}

/// Metadata for a given Key.
#[derive(Clone, Debug, Serialize, Deserialize, Default)]
pub struct Metadata(pub HashMap<String, HashSet<String>>);

impl Deref for Metadata {
    type Target = HashMap<String, HashSet<String>>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl PartialEq for Metadata {
    fn eq(&self, other: &Self) -> bool {
        self.0 == other.0
    }
}

impl Eq for Metadata {}
