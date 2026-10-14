import { useEffect, useState } from 'react'
import { getAgentRank } from '../../../services/api'

function MyRankPage() {
  const [rank, setRank] = useState({ current: 'Business Executive', code: 'B.EX', progress: 0, next: 'Senior Business Executive', needed: 75, levels: [], history: [] })
  useEffect(() => { getAgentRank().then(setRank).catch(() => {}) }, [])
  return (
    <section className="after-rank-page" aria-labelledby="rank-title">
      <header className="after-rank-heading">
        <h1 id="rank-title">My Rank</h1>
        <p>Track your rank progress and history.</p>
      </header>
      <section className="after-rank-progress-card">
        <div className="after-current-rank"><span>Current Rank</span><strong>{rank.current}</strong><b>{rank.code}</b></div>
        <div className="after-rank-progress"><div><span>Progress to {rank.next}</span><strong>{rank.progress}%</strong></div><div className="after-rank-track"><i style={{ width: `${rank.progress}%` }} /></div><small>{rank.needed} more group sales needed to reach {rank.next}</small></div>
      </section>
      <div className="after-rank-columns">
        <section className="after-rank-card"><h2>All Ranks</h2><div className="after-rank-table-wrap"><table className="after-rank-table"><thead><tr><th>Rank</th><th>Min Group Sales</th><th>Min Team</th><th>Online / Cash</th></tr></thead><tbody>{rank.levels.map((level) => <tr key={level.id || level.code}><td>{level.name} <small>({level.code})</small></td><td>{level.needed || 0}</td><td>{level.minTeam || 0}</td><td>{level.online || 0} / {level.cash || 0}</td></tr>)}</tbody></table></div></section>
        <section className="after-rank-card after-rank-history"><h2>Rank History</h2>{rank.history.length ? rank.history.map((item) => <p key={item.date}>{item.rank} · {item.date}</p>) : <p>No rank changes yet.</p>}</section>
      </div>
    </section>
  )
}

export default MyRankPage
