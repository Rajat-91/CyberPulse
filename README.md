# CyberPulse

### See the Signals. Detect the Threats.

**CyberPulse** is a cloud-based cybersecurity log analysis and threat monitoring system that detects suspicious activities from system logs. It analyzes CSV and JSON files, identifies potential security threats, and generates alerts with severity levels.

## Features

- Upload and analyze CSV and JSON log files.
- Automatic log parsing and normalization.
- Detect repeated failed logins and unauthorized access attempts.
- Identify suspicious request patterns.
- Generate security alerts with severity levels.
- Interactive dashboard for monitoring analysis results.

## Tech Stack

| Frontend | Backend | Cloud |
|---|---|---|
| React.js | Python | AWS |
| Vite | FastAPI | S3 |
| CSS | Log Analysis Engine | SQS |
| Recharts | | Lambda |
| Lucide React | | API Gateway |
| | | CloudWatch |

*AWS integration is planned for the next development phase.*

## Project Structure

```text
CyberPulse/
├── backend/
├── frontend/
├── worker/
├── sample_logs/
└── README.md
```

## Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/Rajat-91/CyberPulse.git
cd CyberPulse
```

**2. Install backend dependencies**

```bash
py -m pip install fastapi uvicorn python-multipart
```

**3. Start the backend**

```bash
py -m uvicorn backend.app.main:app --reload
```

**4. Start the frontend**

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` to access CyberPulse.

Backend API documentation: `http://127.0.0.1:8000/docs`

## Cloud Architecture

The planned AWS architecture uses:

- **Amazon S3:** Security log storage.
- **Amazon SQS:** Asynchronous job processing.
- **AWS Lambda:** Serverless log analysis.
- **API Gateway:** API communication.
- **Amazon CloudWatch:** Monitoring and logging.

PostgreSQL will be used for persistent storage of analysis results and security alerts.

## Current Status

- React dashboard and log upload interface developed.
- FastAPI backend implemented.
- CSV and JSON parsing working.
- Python threat detection engine implemented and tested.
- AWS cloud integration is the next development phase.

---

**CyberPulse — Cloud-Based Cybersecurity Log Analysis and Threat Monitoring System**
