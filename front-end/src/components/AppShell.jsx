import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

function AppShell({ brand, sections, routes, defaultRoute, logout }) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isCrmRoute = location.pathname.endsWith('/crm')
  const contentRef = useRef(null)
  const currentTitle =
    routes.find(
      (route) =>
        location.pathname === route.to ||
        location.pathname === `/${route.path}` ||
        location.pathname.endsWith(`/${route.path}`)
    )?.label || 'Overview'

  useEffect(() => {
    if (!contentRef.current) return undefined

    const context = gsap.context(() => {
      gsap.fromTo(contentRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.48, ease: 'power3.out', clearProps: 'transform' })
    }, contentRef)

    return () => context.revert()
  }, [location.pathname])

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className={`app-shell ${['Admin Panel', 'Agent Panel'].includes(brand) ? 'admin-shell' : ''} ${isCrmRoute ? 'crm-shell' : ''} ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {!isCrmRoute && <button type="button" className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      {!isCrmRoute && <aside className="sidebar-panel">
        <div className="brand-block sidebar-brand-header">
          <div className="sidebar-brand-left">
            <div className="brand-logo admin-gurukripa-logo">G</div>
            <div>
              <strong>{brand === 'Admin Panel' ? 'Gurukripa Admin' : brand}</strong>
              <small>Executive Portal</small>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <div onClick={(event) => { if (event.target.closest('a') || event.target.closest('button.logout-button')) setSidebarOpen(false) }}>
          <Sidebar sections={sections} logout={logout} />
        </div>
      </aside>}

      <main className="main-panel">
        <header className="topbar">
          {!isCrmRoute && <div>
            <span className="topbar-label">Workspace</span>
            <h2>{currentTitle}</h2>
          </div>}

          <div className="topbar-actions">
            {!isCrmRoute && <button type="button" className="admin-mobile-toggle md:hidden" aria-label="Open navigation" aria-expanded={sidebarOpen} onClick={() => setSidebarOpen(true)}>
              <span />
              <span />
              <span />
            </button>}
            {!isCrmRoute && <><button type="button" className="ghost-button">Search</button><div className="user-pill">{brand}</div></>}
          </div>
        </header>

        <div className="content-area" ref={contentRef}>
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
            <Route path="*" element={<Navigate to={defaultRoute} replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default AppShell
