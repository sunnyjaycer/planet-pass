use anyhow::Result;
use clap::{load_yaml, App, ArgMatches};
use metadata_db::database::Database;

pub mod add;

fn main() -> Result<()> {
    let yaml = load_yaml!("cli.yml");
    let config = App::from_yaml(yaml).get_matches();

    // Grab sled database
    let database = Database::new(sled::open(config.value_of("DATABASE").unwrap())?);

    match config.subcommand() {
        ("add", Some(sc)) => add_subcommand(database, sc),
        ("remove", Some(sc)) => remove_subcommand(database, sc),
        ("init", Some(sc)) => init_subcommand(database, sc),
        _ => {
            println!("Database was opened, but no subcommand was selected. I will do nothing!");
            Ok(())
        }
    }
}

fn add_subcommand(database: Database, config: &ArgMatches) -> Result<()> {
    println!("Adding");
    Ok(())
}

fn remove_subcommand(database: Database, config: &ArgMatches) -> Result<()> {
    println!("Removing");
    Ok(())
}

fn init_subcommand(database: Database, config: &ArgMatches) -> Result<()> {
    println!("Initialising");
    Ok(())
}
