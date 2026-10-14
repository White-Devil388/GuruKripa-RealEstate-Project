import { useMemo, useState, useCallback } from 'react'
import { useFetchData, useDebounce, useInfiniteScroll } from '../../hooks'
import { getAdminProjects, saveAdminProject, deleteAdminProject } from '../../services/api'
import CrudModal, { ConfirmDeleteModal } from '../../components/CrudModal'

const projectFields = [
  { name: 'name', label: 'Project Name', required: true, placeholder: 'e.g. Northstar City' },
  { name: 'location', label: 'Location', required: true, placeholder: 'e.g. Noida' },
  { name: 'status', label: 'Status', type: 'select', options: ['Ongoing', 'Completed', 'Upcoming'], defaultValue: 'Ongoing' },
  { name: 'plots', label: 'Total Plots', type: 'number', required: true, placeholder: '100' },
  { name: 'rate', label: 'Default Rate', required: true, placeholder: '₹1200/sqft' }
]

function ProjectsPage() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [displayCount, setDisplayCount] = useState(6)
  
  const { data: projects, loading, error, refetch: fetchProjects } = useFetchData(getAdminProjects, [], [])

  const [isCrudOpen, setCrudOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  
  const filteredProjects = useMemo(() => projects.filter((project) => `${project.name} ${project.location}`.toLowerCase().includes(debouncedQuery.toLowerCase())), [debouncedQuery, projects])
  
  const displayProjects = useMemo(() => filteredProjects.slice(0, displayCount), [filteredProjects, displayCount])

  const onLoadMore = useCallback(() => {
    setDisplayCount((prev) => prev + 6)
  }, [])
  
  const observerRef = useInfiniteScroll(onLoadMore, displayCount < filteredProjects.length, false)

  const handleAdd = useCallback(() => {
    setEditingItem(null)
    setCrudOpen(true)
  }, [])

  const handleEdit = useCallback((project) => {
    setEditingItem(project)
    setCrudOpen(true)
  }, [])

  const handleDeleteRequest = useCallback((project) => {
    setEditingItem(project)
    setDeleteOpen(true)
  }, [])

  const handleSave = useCallback(async (data) => {
    try {
      await saveAdminProject(editingItem?.id, data)
      setCrudOpen(false)
      fetchProjects()
    } catch (err) {
      alert(err.message)
    }
  }, [editingItem, fetchProjects])

  const handleConfirmDelete = useCallback(async () => {
    try {
      await deleteAdminProject(editingItem.id)
      setDeleteOpen(false)
      fetchProjects()
    } catch (err) {
      alert(err.message)
    }
  }, [editingItem, fetchProjects])

  return (
    <div className="projects-page">
      <section className="projects-hero">
        <div>
          <span className="eyebrow">Admin Panel</span>
          <h1>Projects</h1>
          <p>Set default ₹/sq ft, manage inventory units, and payment schedules per project.</p>
        </div>
        <button type="button" className="add-project-button" onClick={handleAdd}><span>+</span> Add project</button>
      </section>

      <label className="project-search">
        <span className="sr-only">Search projects</span>
        <input type="search" placeholder="Search by name or location..." value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>

      {error && <p role="alert" style={{ color: 'var(--tone-coral)', margin: '1rem' }}>{error}</p>}

      <div className="project-grid">
        {displayProjects.map((project) => (
          <article className="project-card" key={project.id || `${project.name}-${project.location}`}>
            <div className="project-card-heading"><div><h2>{project.name}</h2><p>{project.location}</p></div><span className="ongoing-badge">{project.status}</span></div>
            <div className="project-stats"><div><span>Total plots</span><strong>{project.plots}</strong></div><div><span>Default rate</span><strong>{project.rate}</strong></div></div>
            <div className="project-main-actions"><button type="button">View plots</button><button type="button" onClick={() => handleEdit(project)}>Edit</button></div>
            <div className="project-secondary-actions"><button type="button" aria-label={`Open ${project.name}`}>➜</button><button type="button" onClick={() => handleDeleteRequest(project)} aria-label={`Delete ${project.name}`}>♧</button></div>
          </article>
        ))}
      </div>
      
      {loading && <p style={{ padding: '1rem', textAlign: 'center' }}>Loading projects...</p>}
      {!loading && filteredProjects.length === 0 && <div className="projects-empty">No projects found.</div>}
      
      {/* Infinite Scroll Trigger Line */}
      <div ref={observerRef} style={{ height: '20px', width: '100%' }} />

      {!loading && filteredProjects.length > 0 && <footer className="projects-pagination" style={{ borderTop: 'none', justifyContent: 'center' }}><span>Showing {displayProjects.length} of {filteredProjects.length} projects</span></footer>}
      
      <CrudModal isOpen={isCrudOpen} onClose={() => setCrudOpen(false)} onSave={handleSave} fields={projectFields} initialData={editingItem} title={editingItem ? 'Edit Project' : 'Add Project'} />
      <ConfirmDeleteModal isOpen={isDeleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleConfirmDelete} itemName={editingItem?.name} />
    </div>
  )
}

export default ProjectsPage
