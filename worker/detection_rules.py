from collections import defaultdict
from datetime import timedelta

from worker.normalizer import parse_timestamp


def is_failed_login(event):
    action = event["action"]
    status = event["status"]

    return (
        ("login" in action or "authentication" in action)
        and (
            status in ["failed", "failure", "denied"]
            or "failed" in action
        )
    )


def is_unauthorized(event):
    action = event["action"]
    status = event["status"]

    return (
        status in ["unauthorized", "forbidden", "denied", "401", "403"]
        or "unauthorized" in action
        or "forbidden" in action
    )


def detect_repeated_failed_logins(events):
    alerts = []
    grouped_events = defaultdict(list)

    for event in events:
        if is_failed_login(event) and event["source_ip"]:
            timestamp = parse_timestamp(event["timestamp"])

            if timestamp:
                grouped_events[event["source_ip"]].append(
                    (timestamp, event)
                )

    for ip, records in grouped_events.items():
        records.sort(key=lambda item: item[0])

        for index in range(len(records)):
            start_time = records[index][0]
            matching_records = []

            for timestamp, event in records[index:]:
                if timestamp - start_time <= timedelta(minutes=1):
                    matching_records.append(event)
                else:
                    break

            if len(matching_records) >= 5:
                alerts.append({
                    "type": "Repeated Failed Logins",
                    "severity": "High",
                    "source_ip": ip,
                    "description": (
                        f"{len(matching_records)} failed login attempts "
                        "within one minute"
                    )
                })
                break

    return alerts


def detect_high_request_volume(events):
    alerts = []
    grouped_events = defaultdict(list)

    for event in events:
        if event["source_ip"]:
            timestamp = parse_timestamp(event["timestamp"])

            if timestamp:
                grouped_events[event["source_ip"]].append(timestamp)

    for ip, timestamps in grouped_events.items():
        timestamps.sort()

        for index in range(len(timestamps)):
            start_time = timestamps[index]
            count = 0

            for timestamp in timestamps[index:]:
                if timestamp - start_time <= timedelta(minutes=1):
                    count += 1
                else:
                    break

            if count >= 20:
                alerts.append({
                    "type": "Unusual Request Volume",
                    "severity": "Medium",
                    "source_ip": ip,
                    "description": (
                        f"{count} requests detected within one minute"
                    )
                })
                break

    return alerts


def detect_unauthorized_access(events):
    alerts = []

    for event in events:
        if is_unauthorized(event):
            alerts.append({
                "type": "Unauthorized Access",
                "severity": "High",
                "source_ip": event["source_ip"] or "Unknown",
                "description": (
                    f"Unauthorized access attempt to "
                    f"{event['endpoint'] or 'a resource'}"
                )
            })

    return alerts


def detect_multiple_account_failures(events):
    alerts = []
    grouped_accounts = defaultdict(set)

    for event in events:
        if is_failed_login(event) and event["source_ip"]:
            if event["username"]:
                grouped_accounts[event["source_ip"]].add(
                    event["username"]
                )

    for ip, accounts in grouped_accounts.items():
        if len(accounts) >= 3:
            alerts.append({
                "type": "Multiple Account Failures",
                "severity": "High",
                "source_ip": ip,
                "description": (
                    f"Failed login attempts against "
                    f"{len(accounts)} different accounts"
                )
            })

    return alerts


def analyze_logs(events):
    alerts = []

    alerts.extend(detect_repeated_failed_logins(events))
    alerts.extend(detect_high_request_volume(events))
    alerts.extend(detect_unauthorized_access(events))
    alerts.extend(detect_multiple_account_failures(events))

    return alerts