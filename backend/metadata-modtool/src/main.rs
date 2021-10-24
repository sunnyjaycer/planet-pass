use crate::items::{AddItem, RemoveItem};
use anyhow::{anyhow, Context, Result};
use clap::{load_yaml, App, ArgMatches};
use metadata_db::{
    database::Database,
    prelude::{CategoryAttribute, Id, IdState, IdStates, Metadata, State},
};
use serde::de::DeserializeOwned;
use std::{fs, path::Path};

pub mod items;

fn main() -> Result<()> {
    let yaml = load_yaml!("cli.yml");
    let config = App::from_yaml(yaml).get_matches();

    // Grab sled database
    let database = Database::new(sled::open(config.value_of("DATABASE").unwrap())?)?;

    match config.subcommand() {
        ("add", Some(sc)) => add_subcommand(database, sc),
        ("remove", Some(sc)) => remove_subcommand(database, sc),
        ("init", Some(sc)) => init_subcommand(database, sc),
        ("print", Some(sc)) => print_subcommand(database, sc),
        _ => {
            println!("Database was opened, but no subcommand was selected. I will do nothing!");
            Ok(())
        }
    }
}

fn add_subcommand(database: Database, config: &ArgMatches) -> Result<()> {
    // Find and deserialze JSON file
    let additions = get_from_file::<Vec<AddItem>>(config, "input")?;

    // If `--overwrite` is not set, check whether any additions will overwrite
    if !config.is_present("overwrite") {
        let overwrites = additions
            .iter()
            .map(|item| {
                Ok((
                    item,
                    database.get_metadata(IdState::from((item.id, item.state)))?,
                ))
            })
            .collect::<Result<Vec<(_, _)>>>()?
            .into_iter()
            .filter_map(|(item, odbm)| odbm.map(|dbm| (item, dbm)))
            .filter_map(|(item, dbm)| {
                (item.metadata != dbm).then(|| IdState::from((item.id, item.state)))
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
        let key = IdState::from((item.id, item.state));
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
        let key = IdState::from((item.id, item.state));
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

fn init_subcommand(database: Database, config: &ArgMatches) -> Result<()> {
    // Prevent overwriting an already-populated database
    if !config.is_present("allow-already-init") && !database.into_inner().is_empty() {
        return Err(anyhow!(
            "Database is already populated. Will not re-initialise!"
        ));
    }

    let state = config.value_of("state").unwrap().parse::<u32>()?;

    let mut count = 0;
    let mut failed = 0;

    // For each file in the directory, read as metadata and insert
    for path in fs::read_dir(config.value_of("input").unwrap())? {
        let path = path.unwrap().path();
        let metadata = match serde_json::from_str::<Metadata>(&fs::read_to_string(&path)?) {
            Ok(v) => v,
            // Do not exit on fail
            Err(e) => {
                eprintln!("{}", e);
                failed += 1;
                continue;
            }
        };

        let key = {
            let id = Id::new(
                path.file_stem()
                    .unwrap()
                    .to_os_string()
                    .into_string()
                    .map_err(|e| anyhow!("{:?}", e))?
                    .parse::<u32>()?,
            );

            IdState::new(id, State::new(state))
        };
        database.add_metadata(key, metadata)?;
        count += 1;
    }

    println!("Initialised {} items, {} could not be read", count, failed);

    Ok(())
}

fn print_subcommand(database: Database, _config: &ArgMatches) -> Result<()> {
    let inner = database.into_inner();

    println!("Main table:");
    for planet in inner.open_tree("planets")?.iter() {
        let (k, v) = planet?;
        let k = bincode::deserialize::<IdState>(&k)?;
        let v = bincode::deserialize::<Metadata>(&v)?;
        println!("{:#?}", k);
        println!("{:#?}", v);
        println!("-----");
    }

    println!("Inverted index:");
    for inverted in inner.open_tree("inverted")?.iter() {
        let (k, v) = inverted?;
        let k = bincode::deserialize::<CategoryAttribute>(&k)?;
        let v = bincode::deserialize::<IdStates>(&v)?;
        println!("{:#?}", k);
        println!("{:#?}", v);
        println!("-----");
    }
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
