use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// The token ID of a Planet.
#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub struct Id(u32);

/// The state of a Planet.
#[derive(Clone, Copy, Debug, Serialize, Deserialize, Default)]
pub struct State(u32);

/// The key for the database, comprising of the ID and the State.
#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub struct DatabaseKey(Id, State);

/// Metadata for a given Key.
#[derive(Clone, Debug, Serialize, Deserialize, Default)]
pub struct Metadata(HashMap<String, Vec<String>>);
