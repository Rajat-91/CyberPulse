import { createContext, useContext, useState } from 'react'
const BASE = import.meta.env.VITE_API_URL
const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)
const read = () => { try { return JSON.parse(localStorage.getItem('ls_session')) } catch { return null } }

export function AuthProvider({ children }) {
  const [session, setSession] = useState(read())
  const save = s => { localStorage.setItem('ls_session', JSON.stringify(s)); setSession(s) }
  async function call(path, body) {
    if (!BASE) { // mock mode: any valid email + 6+ char password works
      if (body.password.length < 6) throw new Error('Password must be at least 6 characters.')
      return { token: 'mock-token', user: { email: body.email, name: body.name || body.email.split('@')[0] } }
    }
    const r = await fetch(BASE + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const d = await r.json().catch(() => ({}))
    if (!r.ok) throw new Error(d.detail || 'Request failed. Check your details and try again.')
    return d
  }
  const login = async (email, password) => save(await call('/auth/login', { email, password }))
  const signup = async (name, email, password) => save(await call('/auth/signup', { name, email, password }))
  const logout = () => { localStorage.removeItem('ls_session'); setSession(null) }
  return <Ctx.Provider value={{ user: session?.user, token: session?.token, login, signup, logout }}>{children}</Ctx.Provider>
}
