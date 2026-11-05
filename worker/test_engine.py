from alert_generator import generate_alerts


sample_events = [
    {
        "timestamp": "2026-11-05T10:00:00",
        "source_ip": "192.168.1.10",
        "username": "admin",
        "action": "login",
        "status": "failed",
        "endpoint": "/login"
    },
    {
        "timestamp": "2026-11-05T10:00:05",
        "source_ip": "192.168.1.10",
        "username": "admin",
        "action": "login",
        "status": "failed",
        "endpoint": "/login"
    },
    {
        "timestamp": "2026-11-05T10:00:10",
        "source_ip": "192.168.1.10",
        "username": "admin",
        "action": "login",
        "status": "failed",
        "endpoint": "/login"
    },
    {
        "timestamp": "2026-11-05T10:00:15",
        "source_ip": "192.168.1.10",
        "username": "admin",
        "action": "login",
        "status": "failed",
        "endpoint": "/login"
    },
    {
        "timestamp": "2026-11-05T10:00:20",
        "source_ip": "192.168.1.10",
        "username": "admin",
        "action": "login",
        "status": "failed",
        "endpoint": "/login"
    },
    {
        "timestamp": "2026-11-05T10:00:25",
        "source_ip": "192.168.1.10",
        "username": "user1",
        "action": "login",
        "status": "failed",
        "endpoint": "/login"
    },
    {
        "timestamp": "2026-11-05T10:00:30",
        "source_ip": "192.168.1.10",
        "username": "user2",
        "action": "login",
        "status": "failed",
        "endpoint": "/login"
    },
    {
        "timestamp": "2026-11-05T10:00:35",
        "source_ip": "192.168.1.10",
        "username": "user3",
        "action": "login",
        "status": "failed",
        "endpoint": "/login"
    },
    {
        "timestamp": "2026-11-05T10:01:00",
        "source_ip": "10.0.0.5",
        "username": "guest",
        "action": "access",
        "status": "403",
        "endpoint": "/admin"
    }
]


if __name__ == "__main__":
    generate_alerts(sample_events)