import json
from typing import List, Dict

folder = "source"


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


def get_frames(manifest: Manifest) -> [List, Dict]:
    data = {}
    frames = []
    background, metadata = get_category(manifest.category("background"))
    [frames.append(x) for x in background]
    data.update(metadata)

    planet, metadata = get_category(manifest.category("common-planet"))
    [frames.append(x) for x in planet]
    data.update(metadata)

    return frames, data


def get_category(category) -> [List, Dict]:
    category_name = category["category"]
    print(category)
    files = []
    metadata = {}
    for subcat in category["subcategories"]:
        category_files, category_metadata = get_subcategory(subcat, category_name)
        [files.append(x) for x in category_files]
        metadata.update(category_metadata)

    print(files, metadata)
    return files, metadata


def get_subcategory(subcategory, category_name: str) -> [List, Dict]:
    subcategory_name = subcategory["subcategory"]

    files = []
    metadata = {}

    for file in subcategory["files"]:
        fils = get_file(file, subcategory_name, category_name)
        files.append(fils)

        # Update metadata
        metadata.update({subcategory_name: file["file"]})

    return files, metadata


def get_file(file, subcategory_name: str, category_name: str) -> List:
    file_basename = file["file"]
    start, end = 0, 131

    images = []
    for i in range(start, end):
        file_name = (
            f"{folder}/{category_name}/{subcategory_name}/{file_basename}_{i:05}.png"
        )
        images.append(file_name)

    return images


if __name__ == "__main__":
    main()
