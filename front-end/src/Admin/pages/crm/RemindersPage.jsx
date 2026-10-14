import CRMSectionPage from './CRMSectionPage'

function RemindersPage() {
  return <CRMSectionPage title="Reminders" description="Never miss an important customer follow-up or commitment." resource="installment-dues" columns={['Reminder', 'Contact', 'Date', 'Status']} mapRecord={(reminder) => [reminder.description || reminder.step || reminder.id, reminder.customer || '-', reminder.dueDate || reminder.date || '-', reminder.status || 'Pending']} />
}

export default RemindersPage
