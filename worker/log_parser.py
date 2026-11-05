
import csv
import json

from worker.normalizer import normalize_event


def parse_log_file(file_path):
    events = []

    if file_path.endswith(".csv"):
        with open(file_path, "r", encoding="utf-8") as file:
            reader = csv.DictReader(file)

            for row in reader:
                events.append(normalize_event(row))

    elif file_path.endswith(".json"):
        with open(file_path, "r", encoding="utf-8") as file:
            data = json.load(file)

            if isinstance(data, list):
                records = data

            elif isinstance(data, dict):
                records = data.get("logs", data.get("events", [data]))

            else:
                raise ValueError("Unsupported JSON structure")

            for record in records:
                if isinstance(record, dict):
                    events.append(normalize_event(record))

    else:
        raise ValueError("Only CSV and JSON files are supported")

    return events
