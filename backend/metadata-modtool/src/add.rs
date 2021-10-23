use metadata_db::prelude::Metadata;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AddItem {
    id: u32,
    state: u32,
    metadata: Metadata,
}
