
# CyberPulse

### See the Signals. Detect the Threats.

CyberPulse is a cloud-based cybersecurity log analysis and threat monitoring system.

## Project Overview

CyberPulse analyzes uploaded security log files to identify suspicious activities using configurable rule-based detection.

## Technology Stack

- Frontend: React + Vite
- Backend: Python + FastAPI
- Cloud: AWS
- Storage: Amazon S3
- Queue: Amazon SQS
- Processing: AWS Lambda
- Database: PostgreSQL (Supabase)

## Core Workflow

Upload Logs → S3 → SQS → AWS Lambda Worker
→ PostgreSQL → React Dashboard

## Main Features

- Security log file upload (CSV/JSON)
- Automated log analysis
- Rule-based threat detection
- Security alerts with severity levels
- Log processing history
- Security monitoring dashboard

## Project Status

Under Development.
