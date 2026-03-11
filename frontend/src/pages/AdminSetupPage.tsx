import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setupAdmin } from '../services/apiClient'

const AdminSetupPage = () => {
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
      await setupAdmin({ userId, password })
      navigate('/admin/login')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Setup failed.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-card">
        <h1>Admin setup</h1>
        <p>Create the first admin account to review responses.</p>
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
              autoComplete="new-password"
            />
          </label>
          {error ? <div className="admin-error">{error}</div> : null}
          <button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create admin'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default AdminSetupPage
