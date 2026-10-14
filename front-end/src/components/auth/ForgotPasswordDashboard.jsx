import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/auth/ForgotPasswordDashboard.css'

function ForgotPasswordDashboard() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSent(true)
  }

  return (
    <main className="forgot-page">
      <section className="forgot-visual" aria-label="Password recovery introduction">
        <div className="forgot-visual-copy">
          <p className="forgot-eyebrow">A secure way back in</p>
          <h1>Get back to the work that matters.</h1>
          <p>Your workspace, your relationships, and every next step are waiting for you.</p>
        </div>
        <div className="forgot-visual-note"><span /> Account recovery is protected with encrypted delivery.</div>
      </section>

      <section className="forgot-panel" aria-labelledby="forgot-title">
        <div className="forgot-panel-inner">
          <Link className="back-link" to="/">&lt;- Back to sign in</Link>
          <div className="forgot-heading">
            <div className="forgot-icon" aria-hidden="true">?</div>
            <p className="forgot-eyebrow">Forgot your password?</p>
            <h2 id="forgot-title">Let&apos;s get you back in.</h2>
            <p>Enter your agent account email and we&apos;ll send you a reset link.</p>
          </div>

          {sent ? (
            <div className="forgot-success" role="status">
              <span className="success-mark" aria-hidden="true">✓</span>
              <h3>Check your inbox</h3>
              <p>If an account exists for <strong>{email}</strong>, a password reset link is on its way.</p>
              <Link className="forgot-primary-link" to="/">Return to sign in</Link>
            </div>
          ) : (
            <form className="forgot-form" onSubmit={handleSubmit}>
              <label htmlFor="recovery-email">Work email</label>
              <input id="recovery-email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" autoComplete="email" required />
              <button className="forgot-submit" type="submit">Send reset link <span aria-hidden="true">-&gt;</span></button>
            </form>
          )}

          <p className="forgot-security"><span aria-hidden="true">+</span> Your account information stays private and protected.</p>
        </div>
      </section>
    </main>
  )
}

export default ForgotPasswordDashboard
