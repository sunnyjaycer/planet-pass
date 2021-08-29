import json
import random
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
        make_image(frames)
        return


def make_image(frames):
    pass


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
    files = []
    metadata = {}
    for subcat in category["subcategories"]:
        category_files, category_metadata = get_subcategory(subcat, category_name)
        [files.append(x) for x in category_files]
        metadata.update(category_metadata)

    return files, metadata


def get_subcategory(subcategory, category_name: str) -> [List, Dict]:
    subcategory_name = subcategory["subcategory"]

    files = []
    metadata = {}

    to_fetch = [file for file in subcategory["files"]]
    multiple = subcategory["multiple"]
    always_on = subcategory["alwaysOn"]

    if multiple:
        # If multiple then filter by chance
        to_fetch = [file for file in to_fetch if chance(file["probability"])]
    else:
        # Otherwise, use choices
        to_fetch = random.choices(
            population=to_fetch,
            weights=[file["probability"] for file in to_fetch],
            k=1
        )

    if not always_on and not chance(subcategory["probability"]):
        return [], {}

    for file in to_fetch:
        fils = get_file(file, subcategory_name, category_name)
        files.append(fils)

        # Update metadata
        new_li = metadata.get(subcategory_name, [])
        new_li.append(file["file"])

        metadata[subcategory_name] = new_li

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


def chance(prob):
    return random.random() < prob


if __name__ == "__main__":
    main()
