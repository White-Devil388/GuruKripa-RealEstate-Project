import { useEffect, useState } from 'react'
import { getAgentReferrals } from '../../../services/api'

function ReferralsPage() {
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState('')
  const [referrals, setReferrals] = useState({ code: 'GK-1004', total: 0, active: 0, pendingKyc: 0, members: [] })
  useEffect(() => { getAgentReferrals().then(setReferrals).catch(() => {}) }, [])
  const personalLink = `https://realestate.ipezb.com/register?referral_code=${referrals.code}`
  const rankLink = `${personalLink}&group=B.EX`
  const visibleMembers = referrals.members.filter((member) => `${member.name} ${member.email}`.toLowerCase().includes(query.toLowerCase()))

  async function copyLink(label, value) {
    if (navigator.clipboard) await navigator.clipboard.writeText(value)
    setCopied(label)
  }

  return (
    <section className="referral-page after-referrals-page" aria-labelledby="referrals-title">
      <header className="referral-heading after-referrals-heading">
        <h1 id="referrals-title">Referrals</h1>
        <p>Grow your team by sharing your referral link.</p>
      </header>

      <section className="referral-card after-referral-links-card">
        <div className="personal-link-card">
          <div className="referral-card-title"><strong>Your Referral Link</strong></div>
          <div className="personal-link-row"><span>{personalLink}</span><button type="button" onClick={() => copyLink('personal', personalLink)}>{copied === 'personal' ? 'Copied' : 'Copy'}</button></div>
          <p>Share this link with your network to invite new team members.</p>
        </div>
        <div className="rank-links-block">
          <div className="referral-card-title"><strong>Rank-wise Referral Links</strong></div>
          <p className="rank-links-description">You can place new joiners into your own rank or any rank below it.</p>
          <div className="rank-link-row"><span className="rank-badge rank-1">B.EX</span><span className="rank-link-value">{rankLink}</span><button type="button" className="small-copy-button" onClick={() => copyLink('rank', rankLink)}>{copied === 'rank' ? 'Copied' : 'Copy'}</button></div>
        </div>
      </section>

      <div className="referral-summary-grid">
        <SummaryCard label="Total Team" value={referrals.total} />
        <SummaryCard label="Active Members" value={referrals.active} tone="green" />
        <SummaryCard label="Pending KYC" value={referrals.pendingKyc} tone="amber" />
      </div>

      <section className="referral-card direct-referrals-card">
        <div className="referral-card-title"><strong>Direct Referrals</strong></div>
        <label className="direct-referral-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or email..." aria-label="Search direct referrals" /></label>
        <div className="direct-referrals-empty">{visibleMembers.length ? visibleMembers.map((member) => <p key={member.email}>{member.name} · {member.email} · {member.status}</p>) : query ? `No referrals found for “${query}”.` : 'No direct referrals yet.'}</div>
      </section>
    </section>
  )
}

function SummaryCard({ label, value, tone = '' }) {
  return <article className={`referral-summary-card ${tone}`}><span>{label}</span><strong>{value}</strong></article>
}

export default ReferralsPage
