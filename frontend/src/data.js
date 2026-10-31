export const SEV = { Critical: '#C62828', High: '#E8710A', Medium: '#B8900B', Low: '#2B6CB0' }
export const alerts = [
  { id: 1, sev: 'Critical', rule: 'Repeated failed logins', who: 'admin', ip: '185.220.101.4', time: '2026-10-31 09:42', detail: '14 failed logins in 6 minutes from one IP.' },
  { id: 2, sev: 'High', rule: 'Multiple account failures', who: '7 accounts', ip: '45.155.205.9', time: '2026-10-31 09:15', detail: 'Failures across 7 accounts within 10 minutes.' },
  { id: 3, sev: 'High', rule: 'Unauthorized access', who: 'svc-backup', ip: '10.2.3.4', time: '2026-10-31 08:51', detail: 'Access to /admin/export denied 9 times.' },
  { id: 4, sev: 'Medium', rule: 'Unusual request volume', who: 'api-client-12', ip: '203.0.113.77', time: '2026-10-31 08:20', detail: '4,800 requests in 5 minutes, 12x the baseline.' },
  { id: 5, sev: 'Low', rule: 'Repeated failed logins', who: 'jdoe', ip: '198.51.100.23', time: '2026-10-30 22:03', detail: '5 failed logins in 10 minutes.' },
  { id: 6, sev: 'Medium', rule: 'Unauthorized access', who: 'guest', ip: '192.0.2.88', time: '2026-10-30 19:37', detail: 'Attempted access to a restricted path.' },
]
export const uploads = [
  { id: 1, name: 'auth-logs-oct30.csv', size: '2.4 MB', status: 'Done', at: '2026-10-31 09:10' },
  { id: 2, name: 'web-access-oct31.json', size: '6.1 MB', status: 'Processing', at: '2026-10-31 09:44' },
  { id: 3, name: 'vpn-events.csv', size: '980 KB', status: 'Queued', at: '2026-10-31 09:45' },
  { id: 4, name: 'broken-export.json', size: '12 KB', status: 'Failed', at: '2026-10-30 21:02' },
]
export const rules = [
  { id: 'failed', name: 'Repeated failed logins', desc: 'Failed logins from one source in a time window', on: true, limit: 5, unit: 'failures', window: 10 },
  { id: 'volume', name: 'Unusual request volume', desc: 'Requests far above the normal rate', on: true, limit: 1000, unit: 'requests', window: 5 },
  { id: 'unauth', name: 'Unauthorized access', desc: 'Denied access to restricted resources', on: true, limit: 3, unit: 'denials', window: 10 },
  { id: 'multi', name: 'Multiple account failures', desc: 'Failures across many accounts from one source', on: false, limit: 4, unit: 'accounts', window: 10 },
]
export const trend = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => ({ d, alerts: [12, 19, 9, 27, 22, 8, 31][i], logs: [820, 1100, 640, 1500, 1320, 510, 1720][i] }))
