import json
import multiprocessing
import os
import random
from pathlib import Path
from shutil import copy
from typing import List, Dict, Optional, Tuple

from PIL import Image
import numpy as np

folder = "/mnt/c/Users/sucle/Documents/PlanetPass-v7"

# Number of anomalies that will be randomly distributed.
anomalies_count = 28

# Container for manifest file
class Manifest:
    def __init__(self, manifest):
        self.manifest = manifest

    # Fetches a category from the manifest
    def category(self, category: str):
        return [x for x in self.manifest if x["category"] == category][0]


# Main function
def main():
    manifest = Manifest(json.load(open("planet_manifest.json")))

    # How many processes to use
    processes = 20

    # How many planets to make
    n = 40

    # List of planets to make (by ID). You can override this.
    items_to_make = list(range(0, n))
    chunks = [x.tolist() for x in np.array_split(items_to_make, processes)]

    # List of processes
    jobs = []

    # Generate worker threads
    for i in chunks:
        process = multiprocessing.Process(target=worker, args=(i, manifest))
        jobs.append(process)

    [j.start() for j in jobs]
    [j.join() for j in jobs]

    print(f"Generated {n} planets. Now generating anomalies")

    # Generate anomalies
    anomaly(n, manifest)


# Main function for generating `n` anomalies
def anomaly(n: int, manifest: Manifest):
    # Determine who to overwrite
    anomalies = list(range(0, n))
    random.shuffle(anomalies)

    reserved = 0

    for n, anomaly in enumerate(
        manifest.category("anomalies")["subcategories"][0]["files"]
    ):
        # If reserved, then offset from 8888 (since 0-8887 inclusive are reserved for airdrops)
        id = anomalies[n]
        if anomaly["reserved"]:
            id = 8888 + reserved
            reserved += 1

        # Make directory
        os.makedirs(f"/mnt/e/planetpass/raw/{str(id)}", exist_ok=True)

        base = get_base()
        frames, audio, metadata = get_anomaly(manifest, anomaly)

        # Write metadata
        with open(f"/mnt/e/planetpass/metadata/{str(id)}.json", "w") as f:
            json.dump(metadata, f)

        # First remove audio files
        fis = os.listdir(f"/mnt/e/planetpass/raw/{str(id)}/")
        for item in fis:
            if item.endswith(".wav"):
                os.remove(os.path.join(f"/mnt/e/planetpass/raw/{str(id)}/", item))

        # Copy audio
        for a in audio:
            a_name = Path(a).name
            copy(a, f"/mnt/e/planetpass/raw/{str(id)}/{a_name}")

        make_image(frames, base, id)
        print(id)


# Get the files for a single anomaly
def get_anomaly(manifest: Manifest, anomaly) -> Tuple[List, Dict]:
    data = {}
    audio = []
    frames = []

    # Get background as normal
    background, aud, metadata = get_category(manifest.category("background"))
    [frames.append(x) for x in background]
    [audio.append(x) for x in aud]
    data.update(metadata)

    # Grab anomaly
    anomaly_files = get_file(anomaly, "anomalies", "anomalies")
    aud = get_audio(anomaly)
    if aud:
        audio.append(aud)

    frames.append(anomaly_files)
    data["anomalies"] = [anomaly["file"]]

    return frames, audio, data


# Worker function that generates a range of images
def worker(items, manifest: Manifest):
    for n in items:
        base = get_base()
        frames, audio, metadata = get_frames(manifest)

        # Make individual planet folder
        os.makedirs(f"/mnt/e/planetpass/raw/{str(n)}", exist_ok=True)

        # Write metadata
        os.makedirs("/mnt/e/planetpass/metadata", exist_ok=True)
        with open(f"/mnt/e/planetpass/metadata/{str(n)}.json", "w") as f:
            json.dump(metadata, f)

        # Copy audio
        for a in audio:
            a_name = Path(a).name
            copy(a, f"/mnt/e/planetpass/raw/{str(n)}/{a_name}")

        make_image(frames, base, str(n))
        print(n)


# Paste images into a folder
def make_image(frames, base, prefix: str):
    for (n, b) in enumerate(base):
        # Open base layer
        frame = Image.open(b)

        # Paste images
        for asset in [x[n] for x in frames]:
            to_paste = Image.open(asset)
            frame.paste(to_paste, mask=to_paste)

        frame.save(f"/mnt/e/planetpass/raw/{prefix}/{prefix}_{n:05}.png")


# Grab all frames for a video
def get_frames(manifest: Manifest) -> Tuple[List, List, Dict]:
    data = {}
    audio = []
    frames = []

    background, aud, metadata = get_category(manifest.category("background"))
    [frames.append(x) for x in background]
    [audio.append(x) for x in aud]
    data.update(metadata)

    planet, aud, metadata = get_category(manifest.category("planet"))
    [frames.append(x) for x in planet]
    [audio.append(x) for x in aud]
    data.update(metadata)

    return frames, audio, data


# Grab all files in a category
def get_category(category) -> Tuple[List, List, Dict]:
    category_name = category["category"]
    files = []
    audio = []
    metadata = {}

    for subcat in category["subcategories"]:
        category_files, category_audio, category_metadata = get_subcategory(
            subcat, category_name
        )

        [files.append(x) for x in category_files]
        [audio.append(x) for x in category_audio]
        metadata.update(category_metadata)

    return files, audio, metadata


# Grab all files in a subcategory
def get_subcategory(subcategory, category_name: str) -> Tuple[List, List, Dict]:
    subcategory_name = subcategory["subcategory"]

    files = []
    audio = []
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
            population=to_fetch, weights=[file["probability"] for file in to_fetch], k=1
        )

    if not always_on and not chance(subcategory["probability"]):
        return [], [], {}

    for file in to_fetch:
        fils = get_file(file, subcategory_name, category_name)
        files.append(fils)

        aud = get_audio(file)
        if aud:
            audio.append(aud)

        # Update metadata
        new_li = metadata.get(subcategory_name, [])
        new_li.append(file["file"])

        metadata[subcategory_name] = new_li

    return files, audio, metadata


# Grab all filenames of a file
def get_file(file, subcategory_name: str, category_name: str) -> List:
    file_basename = file["file"]
    start, end = 0, 131
    if not os.path.isfile(
        f"{folder}/{category_name}/{subcategory_name}/{file_basename}/{file_basename}_{0:05}.png"
    ):
        start, end = 1, 132

    images = []
    for i in range(start, end):
        file_name = f"{folder}/{category_name}/{subcategory_name}/{file_basename}/{file_basename}_{i:05}.png"
        images.append(file_name)

    return images


# Grab the audio portion of a file. Returns None of it cannot be found.
def get_audio(file) -> Optional[str]:
    file_basename = file["file"]
    file_name = f"{folder}/music/{file_basename}.wav"

    if not os.path.isfile(file_name):
        return None
    else:
        return file_name


# Grabs the filenames of the base files
def get_base() -> List:
    images = []
    start, end = 0, 131

    for i in range(start, end):
        file_name = f"{folder}/stars-base/stars-base_{i:05}.png"
        images.append(file_name)

    return images


# Calculates whether a probability happened
def chance(prob):
    return random.random() < prob


if __name__ == "__main__":
    main()
