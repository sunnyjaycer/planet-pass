import json
import multiprocessing
import os
import random
from pathlib import Path
from shutil import copy
from typing import List, Dict, Optional

from PIL import Image

folder = "/mnt/c/Users/sucle/Documents/PlanetPass-v4"

number_of_anomalies = 17


class Manifest:
    def __init__(self, manifest):
        self.manifest = manifest

    def category(self, category: str):
        return [x for x in self.manifest if x["category"] == category][0]


def main():
    manifest = Manifest(json.load(open("planet_manifest.json")))

    processes = 20
    n = 400
    increment, remainder = divmod(n, processes)
    jobs = []
    start = 0
    stop = increment

    for i in range(0, processes):
        process = multiprocessing.Process(target=worker, args=(start, stop, manifest))
        jobs.append(process)
        start = stop
        stop += increment

    # Remainder
    if not start == start + remainder:
        process = multiprocessing.Process(
            target=worker, args=(start, start + remainder, manifest)
        )
        jobs.append(process)

    [j.start() for j in jobs]
    [j.join() for j in jobs]

    print(f"Generated {n} planets. Now generating anomalies")
    anomaly(n, manifest)


def anomaly(n: int, manifest: Manifest):
    # Determine who to overwrite
    anomalies = list(range(0, n))
    random.shuffle(anomalies)

    for n in range(0, number_of_anomalies):
        base = get_base()
        frames, audio, metadata = get_anomaly(manifest, n)

        with open(f"/mnt/e/planetpass/metadata/{str(anomalies[n])}.json", "w") as f:
            json.dump(metadata, f)

        # First remove audio files
        fis = os.listdir(f"/mnt/e/planetpass/raw/{str(anomalies[n])}/")
        for item in fis:
            if item.endswith(".wav"):
                os.remove(
                    os.path.join(f"/mnt/e/planetpass/raw/{str(anomalies[n])}/", item)
                )

        # Copy audio
        for a in audio:
            a_name = Path(a).name
            copy(a, f"/mnt/e/planetpass/raw/{str(anomalies[n])}/{a_name}")

        make_image(frames, base, anomalies[n])
        print(anomalies[n])


def get_anomaly(manifest: Manifest, n: int) -> [List, Dict]:
    data = {}
    audio = []
    frames = []

    # Get background as normal
    background, aud, metadata = get_category(manifest.category("background"))
    [frames.append(x) for x in background]
    [audio.append(x) for x in aud]
    data.update(metadata)

    # Get the nth item in the list of anomalies
    nth_anomaly = manifest.category("anomalies")["subcategories"][0]["files"][n]
    anomaly_files = get_file(nth_anomaly, "anomalies", "anomalies")
    aud = get_audio(nth_anomaly)
    if aud:
        audio.append(aud)

    frames.append(anomaly_files)
    data["anomaly"] = [nth_anomaly["file"]]

    return frames, audio, data


def worker(start: int, stop: int, manifest: Manifest):
    for n in range(start, stop):
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


def make_image(frames, base, prefix: str):
    for (n, b) in enumerate(base):
        # Open base layer
        frame = Image.open(b)

        # Paste images
        for asset in [x[n] for x in frames]:
            to_paste = Image.open(asset)
            frame.paste(to_paste, mask=to_paste)

        frame.save(f"/mnt/e/planetpass/raw/{prefix}/{prefix}_{n:05}.png")


def get_frames(manifest: Manifest) -> [List, List, Dict]:
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


def get_category(category) -> [List, List, Dict]:
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


def get_subcategory(subcategory, category_name: str) -> [List, List, Dict]:
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


def get_audio(file) -> Optional[str]:
    file_basename = file["file"]
    file_name = f"{folder}/music/{file_basename}.wav"

    if not os.path.isfile(file_name):
        return None
    else:
        return file_name


def get_base() -> List:
    images = []
    start, end = 0, 131

    for i in range(start, end):
        file_name = f"{folder}/stars-base/stars-base_{i:05}.png"
        images.append(file_name)

    return images


def chance(prob):
    return random.random() < prob


if __name__ == "__main__":
    main()
