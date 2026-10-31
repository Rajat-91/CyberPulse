import { SEV } from './data'
export const Kpi = ({ label, value, note, tone }) => (
  <div className="kpi"><span className="muted">{label}</span><strong style={tone ? { color: tone } : null}>{value}</strong>{note && <small className="muted">{note}</small>}</div>
)
export const Card = ({ title, children, action }) => (
  <section className="card"><header><h3>{title}</h3>{action}</header>{children}</section>
)
export const Sev = ({ level }) => <span className="sev" style={{ '--c': SEV[level] }}>{level}</span>
export const Status = ({ s }) => <span className={'status ' + s.toLowerCase()}>{s}</span>
export const AlertItem = ({ a, onClick }) => (
  <li className="alert" style={{ '--c': SEV[a.sev] }} onClick={onClick}>
    <div><b>{a.rule}</b><Sev level={a.sev} /></div>
    <small className="muted">{a.who} from {a.ip} at {a.time}</small>
  </li>
)
