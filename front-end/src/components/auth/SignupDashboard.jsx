import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { saveSession, signupUser } from '../../services/api'
import '../../styles/auth/SignupDashboard.css'

const propertyVideo = '/vecteezy_real-estate-agent-house-home-for-living-animation_47912683.mp4'

function SignupDashboard() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const referredBy = searchParams.get('ref') || ''
  const role = 'Agent'
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [kycDocument, setKycDocument] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const kycPlaceholders = {
    aadhaar: 'Enter 12-digit Aadhaar number',
    pan: 'Enter PAN number',
    passport: 'Enter passport number',
    'driving-license': 'Enter driving licence number',
    'voter-id': 'Enter voter ID number',
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)

    if (formData.get('password') !== formData.get('confirmPassword')) {
      setError('Passwords do not match.')
      setIsSubmitting(false)
      return
    }

    try {
      const result = await signupUser({
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        role,
        kycDocument: formData.get('kycDocument'),
        kycDocumentNumber: formData.get('kycDocumentNumber'),
        password: formData.get('password'),
        referredBy,
      })
      saveSession(result)
      navigate('/')
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="signup-page">
      <section className="signup-story" aria-label="Platform introduction">
        <div className="signup-story-copy">
          <p className="signup-eyebrow">Build your next chapter</p>
          <h1>Bring your property business into focus.</h1>
          <p>Join a workspace made for better follow-ups, cleaner operations, and relationships that last beyond closing day.</p>
        </div>
        <div className="signup-video-wrap">
          <video className="signup-video" autoPlay muted loop playsInline aria-label="Real estate home animation">
            <source src={propertyVideo} type="video/mp4" />
          </video>
          <span>Everything your team needs, in one view.</span>
        </div>
      </section>

      <section className="signup-panel" aria-labelledby="signup-title">
        <div className="signup-panel-inner">
          <div className="signup-topline">
            <p className="signup-eyebrow">Create your workspace</p>
            <span>Already a member? <Link to="/">Sign in</Link></span>
          </div>
          <div className="signup-heading">
            <h2 id="signup-title">Start with Northstar</h2>
            <p>Set up your account in less than two minutes.</p>
          </div>

          <div className="signup-role-switcher" aria-label="Account type">
            <button type="button" className="selected" disabled>Agent</button>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="signup-field-grid">
              <label>First name<input name="firstName" type="text" placeholder="Aarav" autoComplete="given-name" required /></label>
              <label>Last name<input name="lastName" type="text" placeholder="Sharma" autoComplete="family-name" required /></label>
            </div>
            <label>Work email<input name="email" type="email" placeholder="you@company.com" autoComplete="email" required /></label>
            <label>Phone number<input name="phone" type="tel" placeholder="+91 98765 43210" autoComplete="tel" required /></label>
            <label>KYC document type<select name="kycDocument" value={kycDocument} onChange={(event) => setKycDocument(event.target.value)} required><option value="" disabled>Select a document</option><option value="aadhaar">Aadhaar Card</option><option value="pan">PAN Card</option><option value="passport">Passport</option><option value="driving-license">Driving Licence</option><option value="voter-id">Voter ID</option></select></label>
            <label>KYC document number<input name="kycDocumentNumber" type="text" placeholder={kycPlaceholders[kycDocument] || 'Select a document first'} autoComplete="off" disabled={!kycDocument} required /></label>
            <div className="signup-field-grid">
              <label>Password<div className="signup-password-field"><input name="password" type={showPassword ? 'text' : 'password'} placeholder="Create password" autoComplete="new-password" minLength="8" required /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button></div></label>
              <label>Confirm password<div className="signup-password-field"><input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Repeat password" autoComplete="new-password" minLength="8" required /><button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>{showConfirmPassword ? 'Hide' : 'Show'}</button></div></label>
            </div>
            <label className="signup-terms"><input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} required /><span>I agree to the Terms of Service and Privacy Policy.</span></label>
            {error && <p role="alert">{error}</p>}
            <button className="signup-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : `Create ${role} account`} <span aria-hidden="true">-&gt;</span></button>
          </form>
          <p className="signup-security"><span aria-hidden="true">+</span> Your information is encrypted and protected.</p>
        </div>
      </section>
    </main>
  )
}

export default SignupDashboard
