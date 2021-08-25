import json
from dataclasses import dataclass
from typing import List, Dict


@dataclass
class Frames:
    celestial: List
    planet_type: str
    # common planet
    core: List
    terrain: List
    features: List
    atmosphere: List
    satellites: List
    ships: List
    # todo weird things


class Manifest:
    def __init__(self, manifest):
        self.manifest = manifest

    def category(self, category: str):
        return [x for x in self.manifest if x["category"] == category][0]


def main():
    manifest = Manifest(json.load(open("planet_manifest.json")))
    worker(0, 10, manifest)


def worker(start: int, stop: int, manifest: Manifest):
    for n in range(start, stop):
        frames, metadata = get_frames(manifest)
        return


def get_frames(manifest: Manifest) -> [Frames, Dict]:
    data = {}
    get_category(manifest.category("background"))
    get_category(manifest.category("common-planet"))

    return 0, 0


def get_category(category):
    category_name = category["category"]
    print(category)
    for subcat in category["subcategories"]:
        get_subcategory(subcat, category_name)
        print()


def get_subcategory(subcategory, category_name: str):
    subcategory_name = subcategory["subcategory"]
    print(subcategory)
    for file in subcategory["files"]:
        get_file(file, subcategory_name, category_name)


def get_file(file, subcategory_name: str, category_name: str):
    print(file, subcategory_name, category_name)


if __name__ == "__main__":
    main()
