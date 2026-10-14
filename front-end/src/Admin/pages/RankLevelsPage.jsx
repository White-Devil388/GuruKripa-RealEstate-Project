import { useEffect, useState } from 'react'
import { listAdminResource } from '../../services/api'

function RankLevelsPage() {
  const [levels, setLevels] = useState([])

  useEffect(() => {
    listAdminResource('rank-levels')
      .then((data) => {
        const formatted = data.map((item, index) => [
          item.name || 'Unknown Rank',
          item.onlinePoints || 50 * (index + 1),
          item.cashPoints || 50 * (index + 1),
          item.needed || 0,
          item.minTeamSize || index * 2 + 4,
          index === 0 ? 4 : 0,
        ])
        setLevels(formatted)
      })
      .catch(console.error)
  }, [])

  return (
    <div className="rank-levels-page">
      <header className="rank-levels-heading">
        <span className="eyebrow">Admin Panel</span>
        <h1>Rank Management</h1>
        <p>View and configure rank qualification criteria.</p>
      </header>

      <section className="rank-levels-card">
        <div className="table-wrap">
          <table className="rank-levels-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Online Points</th>
                <th>Cash Points</th>
                <th>Min Group Sale (SQ.FT)</th>
                <th>Min Team Size</th>
                <th>Agents</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {levels.map(([name, onlinePoints, cashPoints, minGroupSale, minTeamSize, agents], index) => (
                <tr key={name}>
                  <td><span className={index === 0 ? 'rank-level-chip base' : 'rank-level-chip'}>{name}</span></td>
                  <td>{onlinePoints}</td>
                  <td>{cashPoints}</td>
                  <td>{minGroupSale}</td>
                  <td>{minTeamSize}</td>
                  <td><span className="rank-agent-count">{agents}</span></td>
                  <td><button type="button" className="rank-edit-button">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default RankLevelsPage
