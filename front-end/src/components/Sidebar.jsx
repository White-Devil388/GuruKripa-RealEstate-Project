import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

function Sidebar({ sections, logout }) {
  const navigate = useNavigate()
  const [openSections, setOpenSections] = useState(() =>
    Object.fromEntries(sections.map((_, index) => [index, index === 0]))
  )
  const [openDropdowns, setOpenDropdowns] = useState({})

  const toggleSection = (index) => {
    setOpenSections((previous) => ({
      ...previous,
      [index]: !previous[index],
    }))
  }

  const toggleDropdown = (key) => {
    setOpenDropdowns((previous) => ({
      ...previous,
      [key]: !previous[key],
    }))
  }

  return (
    <div className="sidebar-groups">
      {sections.map((section, sectionIndex) => (
        <div className="menu-group" key={section.title}>
          <button
            type="button"
            className="group-toggle"
            onClick={() => toggleSection(sectionIndex)}
            aria-expanded={!!openSections[sectionIndex]}
          >
            <span>{section.title}</span>
            <span className="chevron">{openSections[sectionIndex] ? '−' : '+'}</span>
          </button>

          {openSections[sectionIndex] && (
            <ul className="group-items">
              {section.items.map((item) => {
                const itemKey = item.to || item.path || item.label

                if (item.children?.length) {
                  const isOpen = !!openDropdowns[itemKey]

                  return (
                    <li key={itemKey} className="report-menu-item">
                      <div className="report-menu-header">
                        <button
                          type="button"
                          className="report-toggle"
                          onClick={() => toggleDropdown(itemKey)}
                          aria-expanded={isOpen}
                        >
                          <span>{item.label}</span>
                          <span className="report-chevron">{isOpen ? '−' : '+'}</span>
                        </button>
                      </div>

                      {isOpen && (
                        <ul className="report-submenu">
                          {item.children.map((child) => (
                            <li key={`${itemKey}-${child.path}`}>
                              <NavLink
                                to={`/admin/${child.path}`}
                                className={({ isActive }) => `report-submenu-item ${isActive ? 'active' : ''}`}
                              >
                                {child.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  )
                }

                return (
                  <li key={itemKey}>
                    <NavLink to={item.to} className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
                      {item.label}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      ))}
      {logout && (
        <button type="button" className="menu-item logout-button" onClick={() => navigate(logout.to)}>
          {logout.label}
        </button>
      )}
    </div>
  )
}

export default Sidebar
