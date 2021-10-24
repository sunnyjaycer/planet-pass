use std::{fs, path::Path};

use anyhow::{anyhow, Context, Result};
use clap::{load_yaml, App, ArgMatches};
use metadata_db::{database::Database, prelude::DatabaseKey};
use serde::de::DeserializeOwned;

use crate::items::{AddItem, RemoveItem};

pub mod items;

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
    // Find and deserialze JSON file
    let additions = get_from_file::<Vec<AddItem>>(config, "input")?;

    // If `--no-overwrite` is set, check whether any additions will overwrite
    if config.is_present("no-overwrite") {
        let overwrites = additions
            .iter()
            .map(|item| {
                Ok((
                    item,
                    database.get_metadata(DatabaseKey::from((item.id, item.state)))?,
                ))
            })
            .collect::<Result<Vec<(_, _)>>>()?
            .into_iter()
            .filter_map(|(item, odbm)| odbm.map(|dbm| (item, dbm)))
            .filter_map(|(item, dbm)| {
                (item.metadata != dbm).then(|| DatabaseKey::from((item.id, item.state)))
            })
            .collect::<Vec<_>>();

        if !overwrites.is_empty() {
            eprintln!("Following items will be overwritten: ");
            for key in overwrites {
                eprintln!("{:?}", key);
            }
            return Err(anyhow!(
                "Items will be overwritten with no-overwrite mode enabled."
            ));
        }
    }
    let mut written = 0;
    let mut overwritten = 0;

    // Write to database
    for item in additions {
        let key = DatabaseKey::from((item.id, item.state));
        let old = database.add_metadata(key, item.metadata)?;
        if old.is_some() {
            println!("{:?} was overwritten", key);
            overwritten += 1;
        } else {
            written += 1;
        }
    }

    println!("Added {} items, overwrote {}", written, overwritten);

    Ok(())
}

fn remove_subcommand(database: Database, config: &ArgMatches) -> Result<()> {
    let removals = get_from_file::<Vec<RemoveItem>>(config, "input")?;

    let mut removed = 0;
    let mut nops = 0;

    for item in removals {
        let key = DatabaseKey::from((item.id, item.state));
        let old = database.remove_metadata(key)?;
        if old.is_none() {
            println!("{:?} was empty already", key);
            nops += 1;
        } else {
            removed += 1;
        }
    }

    println!(
        "Removed {} items, and {} items did not exist",
        removed, nops
    );

    Ok(())
}

fn init_subcommand(_database: Database, _config: &ArgMatches) -> Result<()> {
    println!("Initialising");
    Ok(())
}

fn get_from_file<T>(config: &ArgMatches, name: &str) -> Result<T>
where
    T: DeserializeOwned,
{
    let location = config.value_of(name).map(|s| Path::new(s)).unwrap();
    let file_contents =
        fs::read_to_string(location).context("Could not find input file at specified location.")?;
    serde_json::from_str::<T>(&file_contents)
        .context("Could not decode JSON file. Is it properly defined?")
}
