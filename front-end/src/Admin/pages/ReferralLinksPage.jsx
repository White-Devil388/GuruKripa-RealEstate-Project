import { useEffect, useState } from 'react'
import { listAdminResource } from '../../services/api'

const referralUrl = 'https://realestate.ipebir.com/register?referral_code=112233'

function ReferralLinksPage() {
  const [copied, setCopied] = useState('')
  const [rankLinks, setRankLinks] = useState([])

  useEffect(() => {
    listAdminResource('rank-levels')
      .then((data) => {
        const formatted = data.map((item, index) => [
          item.name || 'Unknown Rank',
          index === 0 ? 4 : 0,
          `₹${item.onlinePoints || 50 * (index + 1)}/sqft`,
          `₹${item.cashPoints || 50 * (index + 1)}/sqft`,
        ])
        setRankLinks(formatted)
      })
      .catch(console.error)
  }, [])

  const copyLink = async (key) => {
    try {
      await navigator.clipboard.writeText(referralUrl)
    } catch {
      // Clipboard access can be unavailable outside a secure browser context.
    }
    setCopied(key)
    window.setTimeout(() => setCopied(''), 1600)
  }

  return (
    <div className="referral-page">
      <div className="referral-heading">
        <span className="eyebrow">Admin Panel</span>
        <h1>Referral Links</h1>
        <p>Share these links to onboard new agents directly under Super Admin.</p>
      </div>

      <section className="referral-card personal-link-card">
        <div className="referral-card-title">Personal Referral Link</div>
        <div className="personal-link-row">
          <span>{referralUrl}</span>
          <button type="button" onClick={() => copyLink('personal')}><span aria-hidden="true">▣</span>{copied === 'personal' ? 'Copied' : 'Copy'}</button>
        </div>
        <p>Anyone who signs up using this link will be directly referred to you, joining at the base rank.</p>
      </section>

      <section className="referral-card rank-links-card">
        <div className="referral-card-title">Rank-wise Group Referral Links</div>
        <div className="table-wrap">
          <table className="referral-table">
            <thead><tr><th>Rank</th><th>Agents</th><th>₹/sqft (Online)</th><th>₹/sqft (Cash)</th><th>Referral Link</th><th>Action</th></tr></thead>
            <tbody>{rankLinks.map(([rank, agents, online, cash], index) => <tr key={rank}><td><span className={`rank-badge rank-${index}`}>{rank}</span></td><td><span className="agent-count">{agents}</span></td><td className="commission">{online}</td><td className="commission">{cash}</td><td><span className="link-preview">{referralUrl}</span></td><td><button type="button" className="small-copy-button" onClick={() => copyLink(`rank-${index}`)}><span aria-hidden="true">▣</span>{copied === `rank-${index}` ? 'Copied' : 'Copy'}</button></td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default ReferralLinksPage
