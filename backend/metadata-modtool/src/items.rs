use metadata_db::prelude::{CategoryAttribute, Id, IdState, IdStates, Metadata, State};
use serde::{Deserialize, Serialize};
use serde_with::serde_as;
use std::collections::HashMap;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AddItem {
    pub(crate) id: Id,
    pub(crate) state: State,
    pub(crate) metadata: Metadata,
}

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub struct RemoveItem {
    pub(crate) id: Id,
    pub(crate) state: State,
}

#[serde_as]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct DatabaseDump {
    #[serde_as(as = "Option<Vec<(_, _)>>")]
    pub(crate) planets: Option<HashMap<IdState, Metadata>>,
    #[serde_as(as = "Option<Vec<(_, _)>>")]
    pub(crate) inverted: Option<HashMap<CategoryAttribute, IdStates>>,
}
