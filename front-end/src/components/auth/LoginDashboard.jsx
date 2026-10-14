import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser, saveSession } from '../../services/api'
import '../../styles/auth/LoginDashboard.css'

const propertyVideo = '/vecteezy_real-estate-agent-house-home-for-living-animation_47912683.mp4'

function LoginDashboard({ accountType = 'Agent', adminMode = false }) {
	const navigate = useNavigate()
	const [showPassword, setShowPassword] = useState(false)
	const [rememberMe, setRememberMe] = useState(true)
	const [role] = useState(accountType)
	const [error, setError] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	async function handleSubmit(event) {
		event.preventDefault()
		setError('')
		setIsSubmitting(true)
		const formData = new FormData(event.currentTarget)

		try {
			const result = await loginUser({
				email: formData.get('email'),
				password: formData.get('password'),
				role,
			})
			saveSession(result, rememberMe)

			if (role === 'Admin') {
				navigate('/admin/dashboard')
			} else {
				navigate(result.user?.kycStatus === 'Approved' ? '/agent-after-approval/dashboard' : '/agent-before-approval/dashboard')
			}
		} catch (submitError) {
			setError(submitError.message)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<main className="login-page">
			<section className="login-story" aria-label="Platform introduction">
				<div className="story-content">
					<p className="eyebrow">Real estate operations, in focus</p>
					<h1>Move every relationship forward.</h1>
					<p className="story-copy">One calm workspace for your teams, customers, projects, and the decisions that keep everything moving.</p>
				</div>
				<div className="story-video-wrap">
					<video className="story-video" autoPlay muted loop playsInline aria-label="Real estate home animation">
						<source src={propertyVideo} type="video/mp4" />
					</video>
					<div className="video-caption"><span className="signal-dot" /> A clearer view of what&apos;s next</div>
				</div>
				<div className="story-footer">
					<div className="signal-line"><span /> Live platform status <strong>All systems normal</strong></div>
					<p>Built for teams that think beyond the next transaction.</p>
				</div>
			</section>

			<section className="login-panel" aria-labelledby="login-title">
				<div className="login-panel-inner">
					<div style={{ marginBottom: '16px' }}>
						<Link
							to="/"
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: '6px',
								color: '#536d46',
								fontSize: '0.8rem',
								fontWeight: '600',
								textDecoration: 'none',
								padding: '6px 10px',
								borderRadius: '6px',
								background: '#e8eee7'
							}}
						>
							← Back to Guru Kripa Website
						</Link>
					</div>
					<div className="login-heading">
						<p className="eyebrow">{adminMode ? 'Restricted access' : 'Welcome back'}</p>
						<h2 id="login-title">{adminMode ? 'Admin sign in' : 'Sign in to your workspace'}</h2>
						<p>{adminMode ? 'Authorized administrators only.' : 'Use your Northstar credentials to continue.'}</p>
					</div>
					<div className="role-switcher" aria-label="Account type">
						<button
							type="button"
							className={!adminMode ? 'selected' : ''}
							onClick={() => !adminMode ? null : navigate('/')}
						>
							Agent
						</button>
						<button
							type="button"
							className={adminMode ? 'selected' : ''}
							onClick={() => adminMode ? null : navigate('/admin-login')}
						>
							Admin
						</button>
					</div>
					<form className="login-form" onSubmit={handleSubmit}>
						<label htmlFor="email">Work email</label>
						<input id="email" name="email" type="email" placeholder="you@company.com" autoComplete="email" required />
						<div className="field-label-row"><label htmlFor="password">Password</label><Link className="text-button" to="/forgot-password">Forgot password?</Link></div>
						<div className="password-field">
							<input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" autoComplete="current-password" required />
							<button className="password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button>
						</div>
						<label className="remember-option"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} /><span>Keep me signed in</span></label>
						{error && <p role="alert">{error}</p>}
						<button className="submit-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : `Continue as ${role}`}<span aria-hidden="true">-&gt;</span></button>
					</form>
					{role === 'Agent' ? <p className="signup-prompt">New to Northstar? <Link to="/signup">Create an account</Link></p> : <p className="signup-prompt">Agent account? <Link to="/">Sign in here</Link></p>}
					<p className="security-note"><span className="shield-icon" aria-hidden="true">+</span> Your data is encrypted and protected.</p>
					<p className="login-legal">By continuing, you agree to Northstar&apos;s Terms of Service and Privacy Policy.</p>
				</div>
			</section>
		</main>
	)
}

export default LoginDashboard
