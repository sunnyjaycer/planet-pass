use metadata_db::prelude::{Id, Metadata, State};
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AddItem {
    pub id: Id,
    pub state: State,
    pub metadata: Metadata,
}
