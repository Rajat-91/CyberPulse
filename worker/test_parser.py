from log_parser import parse_log_file
from alert_generator import generate_alerts


if __name__ == "__main__":

    print("\nTesting CSV File")

    csv_events = parse_log_file("../sample_logs/sample_logs.csv")
    generate_alerts(csv_events)

    print("\n\nTesting JSON File")

    json_events = parse_log_file("../sample_logs/sample_logs.json")
    generate_alerts(json_events)