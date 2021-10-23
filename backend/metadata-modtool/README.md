# metadata-modtool

CLI app for updating and managing the Planet Pass metadata database.


## Input file structure
- `add`:
```json
[
    {
        "id": 0,
        "state": 1,
        "metadata": {
            "space": [
                "fabric",
                "sparkles",
            ],
            "core": [
                "core-dots"
            ],
        }
    }
]
```