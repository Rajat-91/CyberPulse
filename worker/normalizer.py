from datetime import datetime


def get_value(data, possible_names, default=""):
    for name in possible_names:
        if name in data and data[name] is not None:
            return str(data[name]).strip()

    return default


def normalize_event(event):
    timestamp = get_value(
        event,
        ["timestamp", "time", "date", "@timestamp"]
    )

    source_ip = get_value(
        event,
        ["source_ip", "src_ip", "ip", "client_ip", "ip_address"]
    )

    username = get_value(
        event,
        ["username", "user", "account", "user_id"]
    )

    action = get_value(
        event,
        ["action", "event", "event_type", "activity"]
    ).lower()

    status = get_value(
        event,
        ["status", "result", "outcome"]
    ).lower()

    endpoint = get_value(
        event,
        ["endpoint", "url", "path", "request"]
    )

    return {
        "timestamp": timestamp,
        "source_ip": source_ip,
        "username": username,
        "action": action,
        "status": status,
        "endpoint": endpoint
    }


def parse_timestamp(timestamp):
    if not timestamp:
        return None

    try:
        return datetime.fromisoformat(
            timestamp.replace("Z", "+00:00")
        )
    except ValueError:
        return None