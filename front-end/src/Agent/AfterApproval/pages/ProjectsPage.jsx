import { useEffect, useState } from 'react'
import { getAgentProjects } from '../../../services/api'

function ProjectsPage() {
  const [query, setQuery] = useState('')
  const [projects, setProjects] = useState([])
  const [error, setError] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)
  useEffect(() => { getAgentProjects().then(setProjects).catch((loadError) => setError(loadError.message)) }, [])
  const visibleProjects = projects.filter((project) => `${project.name} ${project.location}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <section className="projects-page after-projects-page" aria-labelledby="after-projects-title">
      <header className="projects-hero after-projects-heading">
        <div>
          <h1 id="after-projects-title">Projects</h1>
          <p>Browse available real estate projects.</p>
        </div>
      </header>

      <form className="after-project-search" onSubmit={(event) => event.preventDefault()}>
        <span aria-hidden="true">⌕</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by project name or location" aria-label="Search projects" />
      </form>

      <div className="project-grid after-project-grid">
        {visibleProjects.map((project) => <ProjectCard key={project.name} project={project} onDetails={() => setSelectedProject(project)} />)}
        {visibleProjects.length === 0 && <p className="after-project-empty">No projects found.</p>}
      </div>
      {selectedProject && <div className="project-detail-panel"><button type="button" onClick={() => setSelectedProject(null)}>Close</button><h2>{selectedProject.name}</h2><p>{selectedProject.location} · {selectedProject.status}</p><strong>{selectedProject.plots} plots at {selectedProject.rate}</strong></div>}
      {error && <p role="alert">{error}</p>}
    </section>
  )
}

function ProjectCard({ project, onDetails }) {
  return (
    <article className="project-card after-project-card">
      <div className="project-card-heading">
        <div className="after-project-name"><span className="after-project-icon" aria-hidden="true">▥</span><div><h2>{project.name}</h2><p>{project.location}</p></div></div>
      </div>
      <div className="project-stats">
        <div><span>Total Plots</span><strong>{project.plots}</strong></div>
        <div><span>Default Rate</span><strong>{project.rate}</strong></div>
      </div>
      <div className="project-main-actions"><button type="button" className="after-map-button" onClick={onDetails}>⌖ &nbsp;View Availability</button><button type="button" onClick={onDetails}>Details View</button></div>
    </article>
  )
}

export default ProjectsPage
