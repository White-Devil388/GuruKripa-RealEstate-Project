import CRMSectionPage from './CRMSectionPage'

function TasksPage() {
  return <CRMSectionPage title="Tasks" description="Plan follow-ups and keep the sales team on schedule." resource="edit-requests" columns={['Task', 'Assigned to', 'Due date', 'Status']} mapRecord={(task) => [task.title || task.subject || task.id, task.owner || task.emailOwner || '-', task.dueDate || '-', task.status || 'Pending']} />
}

export default TasksPage
