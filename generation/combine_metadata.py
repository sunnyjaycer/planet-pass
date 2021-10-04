import json
import os

output_name = "dump.json"


def main():
    big_json = {}
    for file in os.scandir("/mnt/e/planetpass/metadata/"):
        # Split the file name
        name = file.name.split(".")[0]
        j = json.load(open(file))
        big_json[name] = j

    print(f"Output has {len(big_json)} entries.")

    with open(f"/mnt/e/planetpass/{output_name}", "w") as f:
        json.dump(big_json, f)


if __name__ == "__main__":
    main()
