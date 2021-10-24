use serde::{Deserialize, Serialize};
use std::{
    collections::{HashMap, HashSet},
    ops::Deref,
};

/// The token ID of a Planet.
#[derive(Clone, Copy, Debug, Serialize, Deserialize, PartialEq, Eq, Hash)]
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
#[derive(Clone, Copy, Debug, Serialize, Deserialize, Default, PartialEq, Eq, Hash)]
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

#[derive(Clone, Copy, Debug, Serialize, Deserialize, PartialEq, Eq)]
pub struct IdState(Id, State);

impl IdState {
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

impl From<(Id, State)> for IdState {
    fn from((id, state): (Id, State)) -> Self {
        Self(id, state)
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct Category(String);

impl Category {
    pub fn new(category: String) -> Self {
        Self(category)
    }
}

impl Deref for Category {
    type Target = String;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct Attribute(String);

impl Attribute {
    pub fn new(attribute: String) -> Self {
        Self(attribute)
    }
}

impl Deref for Attribute {
    type Target = String;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

/// Metadata for a given (id, state).
#[derive(Clone, Debug, Serialize, Deserialize, Default)]
pub struct Metadata(pub HashMap<Category, HashSet<Attribute>>);

impl Deref for Metadata {
    type Target = HashMap<Category, HashSet<Attribute>>;

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
