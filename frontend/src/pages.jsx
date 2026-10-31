import { useEffect, useState, useRef } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts'
import { getAlerts, getUploads, getRules, getTrend, uploadLog } from './api'
import { Kpi, Card, Sev, Status, AlertItem } from './components'
import { SEV } from './data'
const useLoad = (fn, init) => { const [v, set] = useState(init); useEffect(() => { fn().then(set) }, []); return [v, set] }

export function Overview() {
  const [alerts] = useLoad(getAlerts, []); const [trend] = useLoad(getTrend, [])
  const byRule = Object.entries(alerts.reduce((m, a) => ({ ...m, [a.rule]: (m[a.rule] || 0) + 1 }), {})).map(([rule, n]) => ({ rule, n }))
  return (<>
    <div className="kpis">
      <Kpi label="Logs processed" value="7.6K" note="this week" /><Kpi label="Alerts" value={alerts.length} note="this week" />
      <Kpi label="Critical" value={alerts.filter(a => a.sev === 'Critical').length} tone={SEV.Critical} /><Kpi label="Files in queue" value="2" note="1 processing" />
    </div>
    <div className="grid">
      <Card title="Alerts per day"><ResponsiveContainer height={240}><AreaChart data={trend}><CartesianGrid stroke="#dfe6e4" vertical={false} /><XAxis dataKey="d" /><YAxis /><Tooltip /><Area dataKey="alerts" stroke="#0F766E" fill="#99d5cc" /></AreaChart></ResponsiveContainer></Card>
      <Card title="Recent alerts"><ul className="list">{alerts.slice(0, 5).map(a => <AlertItem key={a.id} a={a} />)}</ul></Card>
      <Card title="Alerts by rule"><ResponsiveContainer height={220}><BarChart data={byRule} layout="vertical" margin={{ left: 40 }}><XAxis type="number" allowDecimals={false} /><YAxis type="category" dataKey="rule" width={160} /><Tooltip /><Bar dataKey="n" fill="#12302F" radius={3} /></BarChart></ResponsiveContainer></Card>
    </div></>)
}

export function Upload() {
  const [rows, setRows] = useLoad(getUploads, []); const [msg, setMsg] = useState(''); const [drag, setDrag] = useState(false); const ref = useRef()
  async function send(file) {
    if (!file) return
    if (!/\.(csv|json)$/i.test(file.name)) return setMsg('Only .csv and .json files are supported.')
    try { const r = await uploadLog(file); setRows([{ id: r.id, name: file.name, size: (file.size / 1024).toFixed(0) + ' KB', status: r.status, at: new Date().toISOString().slice(0, 16).replace('T', ' ') }, ...rows]); setMsg(`${file.name} was uploaded and queued.`) }
    catch (e) { setMsg(e.message) }
  }
  return (<>
    <div className={'drop' + (drag ? ' on' : '')} onDragOver={e => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); send(e.dataTransfer.files[0]) }}>
      <p>Drop a CSV or JSON log file here</p><button onClick={() => ref.current.click()}>Choose file</button>
      <input ref={ref} type="file" accept=".csv,.json" hidden onChange={e => send(e.target.files[0])} />{msg && <p role="status">{msg}</p>}
    </div>
    <Card title="Upload history"><table><thead><tr><th>File</th><th>Size</th><th>Uploaded</th><th>Status</th></tr></thead>
      <tbody>{rows.map(r => <tr key={r.id}><td>{r.name}</td><td>{r.size}</td><td>{r.at}</td><td><Status s={r.status} /></td></tr>)}</tbody></table></Card>
  </>)
}

export function Alerts() {
  const [alerts] = useLoad(getAlerts, []); const [sev, setSev] = useState('All'); const [sel, setSel] = useState(null)
  const shown = alerts.filter(a => sev === 'All' || a.sev === sev)
  return (<div className="grid one">
    <Card title="Alerts" action={<select value={sev} onChange={e => setSev(e.target.value)} aria-label="Severity">{['All', ...Object.keys(SEV)].map(s => <option key={s}>{s}</option>)}</select>}>
      <table><thead><tr><th>Severity</th><th>Rule</th><th>User</th><th>Source IP</th><th>Time</th></tr></thead>
        <tbody>{shown.map(a => <tr key={a.id} className="click" onClick={() => setSel(a)}><td><Sev level={a.sev} /></td><td>{a.rule}</td><td>{a.who}</td><td>{a.ip}</td><td>{a.time}</td></tr>)}</tbody></table>
      {!shown.length && <p className="muted">No alerts match this filter. Try a different severity.</p>}
    </Card>
    {sel && <div className="drawer"><button onClick={() => setSel(null)}>Close</button><h3>{sel.rule}</h3><Sev level={sel.sev} /><p>{sel.detail}</p><p className="muted">{sel.who} from {sel.ip}<br />{sel.time}</p></div>}
  </div>)
}

export function Rules() {
  const [rules, setRules] = useLoad(getRules, [])
  const upd = (id, p) => setRules(rules.map(r => r.id === id ? { ...r, ...p } : r))
  return (<div className="grid one">{rules.map(r => (
    <Card key={r.id} title={r.name} action={<label className="sw"><input type="checkbox" checked={r.on} onChange={e => upd(r.id, { on: e.target.checked })} /> {r.on ? 'On' : 'Off'}</label>}>
      <p className="muted">{r.desc}</p>
      <div className="row">Alert at <input type="number" min="1" value={r.limit} onChange={e => upd(r.id, { limit: +e.target.value })} /> {r.unit} within <input type="number" min="1" value={r.window} onChange={e => upd(r.id, { window: +e.target.value })} /> minutes</div>
    </Card>))}<button className="primary">Save rules</button></div>)
}

export function Health() {
  const items = [['Amazon S3', 'Healthy', '18 objects stored'], ['Amazon SQS', 'Healthy', '2 messages waiting'], ['Lambda worker', 'Healthy', '41 runs today, 0 errors'], ['Supabase PostgreSQL', 'Healthy', 'Last write 2 minutes ago'], ['API Gateway', 'Degraded', 'Latency above 800 ms']]
  return (<div className="grid">{items.map(([n, s, d]) => <Card key={n} title={n}><Status s={s === 'Healthy' ? 'Done' : 'Failed'} /> <b>{s}</b><p className="muted">{d}</p></Card>)}
    <Card title="Monitoring"><p className="muted">Open Amazon CloudWatch for full metrics and logs.</p></Card></div>)
}
