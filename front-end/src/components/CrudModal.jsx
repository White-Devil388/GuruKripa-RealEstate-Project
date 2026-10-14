import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './CrudModal.css'

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemName }) {
  if (!isOpen) return null

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content confirm-modal">
        <h3>Delete {itemName}?</h3>
        <p>This action cannot be undone. Are you sure you want to delete this record securely?</p>
        <div className="modal-actions">
          <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          <button type="button" onClick={onConfirm} className="delete-btn">Delete</button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function CrudModal({ isOpen, onClose, onSave, fields, initialData, title }) {
  const [formData, setFormData] = useState({})
  
  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      const initial = {}
      fields.forEach(f => initial[f.name] = f.defaultValue || '')
      setFormData(initial)
    }
  }, [initialData, isOpen, fields])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content crud-modal">
        <header>
          <h3>{title}</h3>
          <button type="button" className="close-btn" onClick={onClose}>&times;</button>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {fields.map((field) => (
              <label key={field.name} className="modal-field">
                <span>{field.label}</span>
                {field.type === 'select' ? (
                  <select name={field.name} value={formData[field.name] || ''} onChange={handleChange} required={field.required}>
                    <option value="" disabled>Select {field.label}</option>
                    {field.options && field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea name={field.name} value={formData[field.name] || ''} onChange={handleChange} required={field.required} placeholder={field.placeholder || ''} rows={3} />
                ) : (
                  <input type={field.type || 'text'} name={field.name} value={formData[field.name] || ''} onChange={handleChange} required={field.required} placeholder={field.placeholder || ''} />
                )}
              </label>
            ))}
          </div>
          <footer className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="submit" className="save-btn">{initialData ? 'Update Record' : 'Create Record'}</button>
          </footer>
        </form>
      </div>
    </div>,
    document.body
  )
}
