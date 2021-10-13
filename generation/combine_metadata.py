# Combines the metadata of generated planets into a large file.

import json
import os

output_name = "all_planets.json"


def main():
    big_json = {}
    for file in os.scandir("/mnt/e/planetpass/metadata/"):
        # Split the file name
        name = file.name.split(".")[0]
        j = json.load(open(file))
        big_json[name] = {}
        big_json[name]["metadata"] = j
        big_json[name]["state"] = 0

    print(f"Output has {len(big_json)} entries.")

    with open(f"/mnt/e/planetpass/{output_name}", "w") as f:
        json.dump(big_json, f)


if __name__ == "__main__":
    main()
