use anyhow::Result;
use clap::{load_yaml, App};
use metadata_db::database::Database;

pub mod add;

fn main() -> Result<()> {
    let yaml = load_yaml!("cli.yml");
    let config = App::from_yaml(yaml).get_matches();

    // Grab sled database
    let database = Database::new(sled::open(config.value_of("DATABASE").unwrap())?);

    match config.subcommand() {
        ("add", Some(sc)) => {
            println!("Adding");
        }

        ("remove", Some(sc)) => {
            println!("Removing");
        }

        ("init", Some(sc)) => {
            println!("Initing");
        }

        _ => {
            println!("Can't do anything")
        }
    }

    Ok(())
}
