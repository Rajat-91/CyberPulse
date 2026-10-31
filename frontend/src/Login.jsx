import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './auth'
export default function Login() {
  const { user, login, signup } = useAuth()
  const [mode, setMode] = useState('login'); const [f, setF] = useState({ name: '', email: '', password: '' })
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)
  if (user) return <Navigate to="/" replace />
  const set = k => e => setF({ ...f, [k]: e.target.value })
  async function submit(e) {
    e.preventDefault(); setErr(''); setBusy(true)
    try { mode === 'login' ? await login(f.email, f.password) : await signup(f.name, f.email, f.password) }
    catch (x) { setErr(x.message) } finally { setBusy(false) }
  }
  return (
    <div className="authwrap"><form className="card authcard" onSubmit={submit}>
      <div className="brand dark">CyberPulse</div>
      <h3>{mode === 'login' ? 'Log in to your account' : 'Create your account'}</h3>
      {mode === 'signup' && <label>Name<input required value={f.name} onChange={set('name')} /></label>}
      <label>Email<input type="email" required value={f.email} onChange={set('email')} autoComplete="email" /></label>
      <label>Password<input type="password" required minLength={6} value={f.password} onChange={set('password')} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
      {err && <p className="err" role="alert">{err}</p>}
      <button className="primary" disabled={busy}>{busy ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Sign up'}</button>
      <p className="muted">{mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
        <a href="#" onClick={e => { e.preventDefault(); setErr(''); setMode(mode === 'login' ? 'signup' : 'login') }}>{mode === 'login' ? 'Create an account' : 'Log in'}</a></p>
    </form></div>
  )
}
