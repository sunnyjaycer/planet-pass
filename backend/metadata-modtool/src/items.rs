use metadata_db::prelude::{Id, Metadata, State};
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AddItem {
    pub id: Id,
    pub state: State,
    pub metadata: Metadata,
}

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub struct RemoveItem {
    pub id: Id,
    pub state: State,
}
