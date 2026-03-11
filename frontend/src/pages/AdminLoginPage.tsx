import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../services/apiClient'

const AdminLoginPage = () => {
  const navigate = useNavigate()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await loginAdmin({ userId, password })
      navigate('/admin/review')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-card">
        <h1>Admin login</h1>
        <p>Sign in to review participant responses.</p>
        <form onSubmit={handleSubmit} className="admin-form">
          <label>
            User ID
            <input
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              required
              minLength={3}
              autoComplete="username"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              autoComplete="current-password"
            />
          </label>
          {error ? <div className="admin-error">{error}</div> : null}
          <button type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default AdminLoginPage
