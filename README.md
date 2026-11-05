# CyberPulse — Cloud-Based Cybersecurity Log Analysis and Threat Monitoring System

**Tagline:** See the Signals. Detect the Threats.

CyberPulse is a cybersecurity log analysis and threat monitoring system designed to identify suspicious activities from system log files. It allows users to upload CSV and JSON log files, analyze security events, and detect potential threats using predefined detection rules.

The project is being developed with a cloud-based architecture using AWS services.

---

## 1. Project Overview

CyberPulse aims to simplify security log monitoring by automatically analyzing uploaded log files and identifying suspicious patterns.

The system currently supports:

- CSV and JSON log file uploads.
- Automatic log parsing and normalization.
- Detection of suspicious login activities.
- Detection of unauthorized access attempts.
- Generation of security alerts with severity levels.
- A React-based dashboard for interacting with the system.
- A FastAPI backend for processing uploaded files.

## 2. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js |
| Frontend tooling | Vite |
| Styling | CSS |
| Icons | Lucide React |
| Charts | Recharts |
| Backend | Python |
| Backend framework | FastAPI |
| API server | Uvicorn |
| Log processing | Python |
| Supported formats | CSV, JSON |
| Planned database | PostgreSQL |
| Planned cloud platform | Amazon Web Services (AWS) |

## 3. Current Project Structure

```text
CyberPulse/
│
├── backend/
│   ├── __init__.py
│   └── app/
│       ├── __init__.py
│       └── main.py
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── public/
│   ├── package.json
│   └── ...
│
├── worker/
│   ├── __init__.py
│   ├── log_parser.py
│   ├── normalizer.py
│   ├── detection_rules.py
│   ├── alert_generator.py
│   ├── test_engine.py
│   └── test_parser.py
│
├── sample_logs/
│   ├── sample_logs.csv
│   └── sample_logs.json
│
└── README.md
```

## 4. Threat Detection Engine

The Python detection engine analyzes normalized log events and identifies suspicious activities.

The implemented detection rules include:

### 4.1 Repeated Failed Logins
Detects five or more failed login attempts from the same IP address within one minute.

### 4.2 Unusual Request Volume
Identifies unusually high request activity from a single IP address within a short time period.

### 4.3 Unauthorized Access
Detects attempts to access restricted endpoints, such as `/admin` and `/dashboard`.

### 4.4 Failed Logins Against Multiple Accounts
Detects repeated failed login attempts from the same IP address against three or more different accounts.

**Note:** These rules identify suspicious indicators. An alert does not necessarily mean that a system has been compromised.

## 5. Backend Implementation

The backend is developed using FastAPI.

### Available API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Checks whether the backend is running |
| GET | `/api/health` | Returns backend health status |
| POST | `/api/upload` | Uploads and analyzes log files |

### File Upload Functionality

The upload API currently:

1. Receives a CSV or JSON file.
2. Validates the file extension.
3. Checks whether the uploaded file is empty.
4. Enforces a maximum file size of 10 MB.
5. Temporarily stores the uploaded file.
6. Parses and normalizes the log events.
7. Runs the threat detection engine.
8. Calculates alert counts by severity.
9. Returns the analysis results to the frontend.
10. Deletes the temporary file after processing.

### Example API Response

```json
{
  "success": true,
  "filename": "sample_logs.csv",
  "total_logs": 7,
  "total_alerts": 3,
  "high_alerts": 3,
  "medium_alerts": 0,
  "alerts": [
    {
      "type": "Repeated Failed Logins",
      "severity": "High",
      "source_ip": "192.168.1.10",
      "description": "5 failed login attempts within one minute"
    }
  ]
}
```

## 6. Frontend Implementation

The frontend is developed using React and Vite.

The current interface includes:

- CyberPulse dashboard.
- Overview page.
- Log upload page.
- File selection and upload functionality.
- Analysis result display.
- Security alert information.
- Dashboard charts and metric cards.

The interface uses a professional dark cybersecurity theme with cyan accents.

**Current limitation:** Some Overview dashboard statistics and charts still use sample data. Backend persistence and integration of cumulative real-time dashboard statistics are planned.

## 7. Running the Project Locally

### Prerequisites

Install the following:

- Python
- Node.js and npm
- A code editor such as Visual Studio Code

### Step 1: Install Backend Dependencies

Open a terminal in the project root:

```bash
py -m pip install fastapi uvicorn python-multipart
```

### Step 2: Start the Backend

Run:

```bash
py -m uvicorn backend.app.main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

### Step 3: Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

### Step 4: Test Log Analysis

1. Open the CyberPulse frontend.
2. Navigate to the log upload page.
3. Select a CSV or JSON file.
4. Upload the file.
5. View the analysis results and detected alerts.

Sample log files are available in the `sample_logs` directory.

## 8. Testing Performed

The following functionality has been tested successfully:

- CSV log parsing.
- JSON log parsing.
- Log normalization.
- Threat detection rules.
- Alert generation.
- FastAPI backend startup.
- API health endpoint.
- File upload through the API.
- Analysis of uploaded CSV and JSON files.

### Sample Test Results

| Test | Result |
|---|---|
| CSV parsing | Passed |
| JSON parsing | Passed |
| Threat detection engine | Passed |
| Backend API | Passed |
| CSV upload and analysis | Passed |
| JSON upload and analysis | Passed |

A sample CSV test containing seven log events successfully generated three high-severity alerts.

## 9. Planned Cloud Architecture

The next development phase is to integrate CyberPulse with AWS cloud services.

The planned architecture is:

```text
React Frontend
      |
      v
Amazon API Gateway
      |
      v
AWS Lambda (API Handler)
      |
      +------> Amazon S3
      |         Log File Storage
      |
      +------> Amazon SQS
                Analysis Job Queue
                      |
                      v
              AWS Lambda (Worker)
                      |
                      v
             Python Detection Engine
                      |
                      v
                PostgreSQL
                      |
                      v
              Dashboard Statistics
```

Amazon CloudWatch will be used for monitoring and logging AWS resources.

### Planned AWS Services

| AWS Service | Purpose |
|---|---|
| Amazon S3 | Store uploaded security log files |
| Amazon SQS | Manage asynchronous log-analysis requests |
| AWS Lambda | Execute backend and log-processing functions |
| Amazon API Gateway | Expose backend APIs |
| Amazon CloudWatch | Monitor execution, errors and system activity |
| IAM | Manage permissions and secure service access |

These cloud integrations are planned and have not yet been implemented.

## 10. Future Enhancements

- AWS cloud service integration.
- Persistent storage of uploaded logs and alerts.
- Real dashboard statistics from backend data.
- Historical log analysis.
- Improved threat detection rules.
- Security alert filtering and search.
- Activity monitoring and visualization.
- Cloud-based deployment and monitoring.

---

## Project Status

**Current stage:** Local application development and testing completed for the initial log-analysis workflow.

**Next stage:** AWS cloud integration and persistent storage.

**Project name:** CyberPulse  
**Project category:** Cloud Computing / Cybersecurity  
**Tagline:** See the Signals. Detect the Threats.
