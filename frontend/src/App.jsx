import { NavLink, Routes, Route, Navigate } from 'react-router-dom'
import { Overview, Upload, Alerts, Rules, Health } from './pages'
import Login from './Login'
import { useAuth } from './auth'
const nav = [['/', 'Overview'], ['/upload', 'Upload logs'], ['/alerts', 'Alerts'], ['/rules', 'Rules'], ['/health', 'System health']]

function Layout() {
  const { user, logout } = useAuth()
  return (
    <div className="shell">
      <aside>
        <div className="brand">CyberPulse</div>
        <nav>{nav.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'}>{l}</NavLink>)}</nav>
        <div className="me"><small>Signed in as</small><b>{user.name}</b><small className="muted">{user.email}</small><button onClick={logout}>Log out</button></div>
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
export default function App() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={user ? <Layout /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}
