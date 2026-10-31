import { NavLink, Routes, Route } from 'react-router-dom'
import { Overview, Upload, Alerts, Rules, Health } from './pages'
const nav = [['/', 'Overview'], ['/upload', 'Upload logs'], ['/alerts', 'Alerts'], ['/rules', 'Rules'], ['/health', 'System health']]
export default function App() {
  return (
    <div className="shell">
      <aside>
        <div className="brand">CyberPulse</div>
        <nav>{nav.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'}>{l}</NavLink>)}</nav>
        <small className="muted">Cloud log analysis and threat monitoring</small>
      </aside>
      <main>
        <header className="top">
          <input placeholder="Search alerts by IP, user or rule" aria-label="Search" />
          <select aria-label="Time range"><option>Last 7 days</option><option>Last 24 hours</option><option>Last 30 days</option></select>
        </header>
        <Routes>
          <Route path="/" element={<Overview />} /><Route path="/upload" element={<Upload />} />
          <Route path="/alerts" element={<Alerts />} /><Route path="/rules" element={<Rules />} /><Route path="/health" element={<Health />} />
        </Routes>
      </main>
    </div>
  )
}
