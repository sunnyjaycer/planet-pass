import json
import os

state = 0

media_id = f"https://assets.wanderers.ai/file/planetpass/{str(state)}"


def main():
    manifest = json.load(open("planet_manifest.json"))
    readable_names = make_readable_names(manifest)

    # Set up metadata2 folder
    os.makedirs(f"/mnt/e/planetpass/metadata2/{str(state)}", exist_ok=True)

    for filename in os.scandir("/mnt/e/planetpass/metadata"):
        metadata = json.load(open(filename.path))
        name = filename.name.split(".")[0]
        transformed = transform(metadata, readable_names, name)

        with open(f"/mnt/e/planetpass/metadata2/{str(state)}/{name}", "w") as f:
            json.dump(transformed, f)


def make_readable_names(manifest):
    rnames = {}
    for category in manifest:
        for subcategory in category["subcategories"]:
            # Names for subcategories
            rnames[subcategory["subcategory"]] = subcategory["readableName"]
            for file in subcategory["files"]:
                # Names for files
                rnames[file["file"]] = file["readableName"]

    return rnames


def transform(data, readable_names, file_name):
    print(file_name)

    metadata = {
        "animation_url": f"{media_id}/{file_name}.mp4",
        "image": f"{media_id}/{file_name}.mp4",
        "attributes": [],
    }

    for x in data.items():
        for item in x[1]:
            metadata["attributes"].append(
                {"trait_type": readable_names[x[0]], "value": readable_names[item]}
            )

    return metadata


if __name__ == "__main__":
    main()
