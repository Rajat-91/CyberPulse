from detection_rules import analyze_logs


def generate_alerts(events):
    alerts = analyze_logs(events)

    print("\n========== CYBERPULSE SECURITY REPORT ==========")

    print(f"\nTotal log entries: {len(events)}")
    print(f"Total alerts detected: {len(alerts)}")

    if not alerts:
        print("\nNo suspicious activity detected.")

    else:
        print("\nDetected Security Alerts:")

        for number, alert in enumerate(alerts, start=1):
            print(f"\nAlert {number}")
            print(f"Type: {alert['type']}")
            print(f"Severity: {alert['severity']}")
            print(f"Source IP: {alert['source_ip']}")
            print(f"Description: {alert['description']}")

    print("\n================================================")

    return alerts