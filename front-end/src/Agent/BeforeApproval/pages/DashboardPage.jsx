import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { getAgentDashboard } from '../../../services/api'

function DashboardPage() {
  const dashboardRef = useRef(null)
  const [dashboard, setDashboard] = useState({ name: 'Agent', role: 'Business Executive (B.EX)', referralCode: '—', kycStatus: 'Pending' })
  const [error, setError] = useState('')

  useEffect(() => {
    getAgentDashboard().then(setDashboard).catch((loadError) => setError(loadError.message))
  }, [])

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      timeline
        .from('.before-dashboard-header', { opacity: 0, y: -18, duration: 0.5 })
        .from('.kyc-pending-banner', { opacity: 0, y: 18, duration: 0.55 }, '-=0.28')
        .from('.before-dashboard-welcome', { opacity: 0, y: 18, duration: 0.55 }, '-=0.3')
        .from('.dashboard-icon-button, .dashboard-avatar, .complete-kyc-button, .referral-card', { opacity: 0, scale: 0.88, duration: 0.4, stagger: 0.08 }, '-=0.25')
    }, dashboardRef)

    return () => context.revert()
  }, [])

  return (
    <section ref={dashboardRef} className="before-dashboard" aria-labelledby="before-dashboard-title">
      <header className="before-dashboard-header">
        <h1 id="before-dashboard-title">AGENT DASHBOARD</h1>
        <div className="before-dashboard-actions" aria-label="Dashboard actions">
          <button type="button" className="dashboard-icon-button" aria-label="Toggle dark mode">◐</button>
          <button type="button" className="dashboard-icon-button" aria-label="Open settings">⚙</button>
          <div className="dashboard-avatar" aria-label="Agent profile">A</div>
        </div>
      </header>

      <div className="kyc-pending-banner" role="status">
        <div className="kyc-warning-icon" aria-hidden="true">!</div>
        <div className="kyc-banner-copy">
          <h2>KYC Verification Pending</h2>
          <p>Your KYC verification is currently pending. Please complete your profile to unlock all features and start earning commissions.</p>
        </div>
        <Link to="/agent-before-approval/kyc" className="complete-kyc-button">Complete KYC<br />NOW</Link>
      </div>

      <section className="before-dashboard-welcome" aria-label="Agent welcome">
        <div>
          <h2>Welcome back, {dashboard.name}!</h2>
          <div className="agent-role-badge"><span aria-hidden="true">✿</span> {dashboard.role}</div>
        </div>
        <div className="referral-card">
          <span>Referral Code</span>
          <div className="referral-value">
            <strong>{dashboard.referralCode}</strong>
            <button type="button" aria-label="Copy referral code" onClick={() => navigator.clipboard?.writeText(dashboard.referralCode)}>▣</button>
          </div>
        </div>
      </section>
      {error && <p role="alert">{error}</p>}
    </section>
  )
}

export default DashboardPage
