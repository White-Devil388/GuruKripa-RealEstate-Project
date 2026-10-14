import { useEffect, useMemo, useState } from 'react'
import { getAgentTeam } from '../../../services/api'

function MyTeamPage() {
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState('all')
  const [team, setTeam] = useState({ total: 0, active: 0, pendingKyc: 0, members: [] })
  useEffect(() => { getAgentTeam().then(setTeam).catch(() => {}) }, [])
  const visibleMembers = useMemo(() => team.members.filter((member) => `${member.name} ${member.email}`.toLowerCase().includes(query.toLowerCase()) && (level === 'all' || member.level === level)), [team.members, query, level])

  return (
    <section className="after-team-page" aria-labelledby="after-team-title">
      <header className="after-team-heading">
        <div>
          <h1 id="after-team-title">My Team</h1>
          <p>View and manage your referred team members.</p>
        </div>
      </header>

      <div className="after-team-summary">
        <TeamSummary label="Total Team" value={team.total} />
        <TeamSummary label="Active Members" value={team.active} tone="green" />
        <TeamSummary label="Pending KYC" value={team.pendingKyc} tone="amber" />
      </div>

      <section className="after-team-card">
        <div className="after-team-card-heading"><strong>Team Members</strong><span>Build your network and track your team.</span></div>
        <div className="after-team-controls">
          <label className="after-team-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or email..." aria-label="Search team members" /></label>
          <div className="after-team-levels" aria-label="Filter team level">
            {['all', 'level-1', 'level-2', 'level-3'].map((item) => <button key={item} type="button" className={level === item ? 'active' : ''} onClick={() => setLevel(item)}>{item === 'all' ? 'All' : item.replace('-', ' ')}</button>)}
          </div>
        </div>
        <div className="after-team-empty">{visibleMembers.length ? visibleMembers.map((member) => <p key={member.email}>{member.name} · {member.email}</p>) : query || level !== 'all' ? 'No team members found for the selected filters.' : 'No team members yet.'}</div>
      </section>
    </section>
  )
}

function TeamSummary({ label, value, tone = '' }) {
  return <article className={`after-team-summary-card ${tone}`}><span>{label}</span><strong>{value}</strong></article>
}

export default MyTeamPage
