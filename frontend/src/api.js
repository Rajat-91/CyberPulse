import { alerts, uploads, rules, trend } from './data'
const BASE = import.meta.env.VITE_API_URL
const auth = () => { try { return { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('ls_session')).token } } catch { return {} } }
const expired = r => { if (r.status === 401) { localStorage.removeItem('ls_session'); location.href = '/login' } }
const get = async (path, fallback) => {
  if (!BASE) return fallback
  try { const r = await fetch(BASE + path, { headers: auth() }); expired(r); if (!r.ok) throw 0; return await r.json() } catch { return fallback }
}
export const getAlerts = () => get('/alerts', alerts)
export const getUploads = () => get('/uploads', uploads)
export const getRules = () => get('/rules', rules)
export const getTrend = () => get('/alerts/trend', trend)
export async function uploadLog(file) {
  if (!BASE) return { id: 'mock-' + Date.now(), name: file.name, status: 'Queued' }
  const r = await fetch(BASE + '/upload', { method: 'POST', headers: auth(), body: (() => { const f = new FormData(); f.append('file', file); return f })() })
  if (!r.ok) throw new Error('Upload failed. Check the file format and try again.')
  return r.json()
}
