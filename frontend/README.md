# LogSentinel (frontend)
React + Vite dashboard for the Cloud-Based Cybersecurity Log Analysis and Threat Monitoring System.

## Run
1. `npm install`
2. `npm run dev` (opens with mock data)
3. To use the backend: copy `.env.example` to `.env` and set `VITE_API_URL` to your API Gateway URL.

## Expected API
- `POST /upload` (multipart `file`) -> `{id, status}`
- `GET /uploads`, `GET /alerts`, `GET /alerts/trend`, `GET /rules`
