use serde::{Deserialize, Serialize};
use std::{
    collections::{HashMap, HashSet},
    ops::Deref,
};

/// The token ID of a Planet.
#[derive(Clone, Copy, Debug, Serialize, Deserialize, PartialEq, Eq)]
pub struct Id(u32);

impl Id {
    pub fn new(id: u32) -> Self {
        Self(id)
    }
}

impl Deref for Id {
    type Target = u32;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

/// The state of a Planet.
#[derive(Clone, Copy, Debug, Serialize, Deserialize, Default, PartialEq, Eq)]
pub struct State(u32);

impl State {
    pub fn new(state: u32) -> Self {
        Self(state)
    }
}

impl Deref for State {
    type Target = u32;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

/// The key for the database, comprising of the ID and the State.
#[derive(Clone, Copy, Debug, Serialize, Deserialize, PartialEq, Eq)]
pub struct DatabaseKey(Id, State);

impl DatabaseKey {
    pub fn new(id: Id, state: State) -> Self {
        Self(id, state)
    }

    pub fn id(self) -> Id {
        self.0
    }

    pub fn state(self) -> State {
        self.1
    }
}

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
