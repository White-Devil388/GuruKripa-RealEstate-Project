import { useState, useEffect } from 'react'
import { listAdminResource } from '../../services/api'

function FullTreePage() {
  const [zoom, setZoom] = useState(100)
  const [project, setProject] = useState('The Crown City (Pool ₹500/sqft)')
  const [agents, setAgents] = useState([])

  useEffect(() => {
    listAdminResource('full-tree')
      .then((data) => {
        const formattedAgents = data.map((item) => ({
          name: item.name || 'Unknown',
          rank: item.rank || 'Business Executive',
          cap: item.cap || 50, // default if not provided by backend yet
          initial: (item.name || 'U').charAt(0).toUpperCase(),
          level: item.level || 1,
          status: item.status || 'Active'
        }))
        setAgents(formattedAgents)
      })
      .catch(console.error)
  }, [])

  const downloadTree = () => {
    const contents = ['Full Company Tree', 'The Crown City', 'Company - POOL ₹500', ...agents.map((agent) => `${agent.name} - ${agent.rank} - CAP ₹${agent.cap}`)].join('\n')
    const blob = new Blob([contents], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'full-company-tree.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="full-tree-page">
      <div className="full-tree-topbar">
        <span>Full Company Tree</span>
        <div className="full-tree-actions">
          <button type="button" className="tree-download-button" onClick={downloadTree}><span aria-hidden="true">⇩</span> Download</button>
          <label className="tree-project-select">
            <span className="sr-only">Select project</span>
            <select value={project} onChange={(event) => setProject(event.target.value)}>
              <option>The Crown City (Pool ₹500/sqft)</option>
              <option>Green Valley (Pool ₹350/sqft)</option>
            </select>
          </label>
        </div>
      </div>

      <section className="full-tree-content">
        <p className="full-tree-note">Cap = rate assigned to that person by their upline · Pool = total rate allotted by the company for this project (per sqft)</p>
        <div className="tree-controls">
          <button type="button" aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(60, value - 10))}>−</button>
          <span>{zoom}%</span>
          <button type="button" aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(140, value + 10))}>+</button>
          <button type="button" onClick={() => setZoom(100)}>Reset</button>
        </div>

        <div className="tree-canvas">
          <div className="tree-stage" style={{ transform: `scale(${zoom / 100})` }}>
            <div className="tree-company-node"><span className="tree-company-mark" aria-hidden="true" /><strong>The Crown City</strong><small>Company</small><span>POOL ₹500</span></div>
            <div className="tree-branch-line" />
            <div className="tree-agent-row">{agents.map((agent) => <div className="tree-agent-node" key={agent.name}><span className="tree-avatar">{agent.initial}</span><strong>{agent.name}</strong><small>{agent.rank}</small><span>CAP ₹{agent.cap}</span></div>)}</div>
          </div>
        </div>

        <div className="full-tree-list-heading"><strong>Full Tree</strong> — List View</div>
        <div className="table-wrap full-tree-table-wrap">
          <table className="full-tree-table">
            <thead><tr><th>LEVEL</th><th>NAME</th><th>DESIGNATION</th><th>STATUS</th><th>CAP/POOL (₹)</th></tr></thead>
            <tbody><tr><td>1</td><td>The Crown City</td><td>Company</td><td>—</td><td>₹500</td></tr>{agents.map((agent) => <tr key={`list-${agent.name}`}><td>2</td><td>{agent.name}</td><td>{agent.rank}</td><td>Active</td><td>₹0</td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default FullTreePage
