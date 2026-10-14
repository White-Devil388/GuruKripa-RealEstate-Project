import http from './http';

export const getLeads = async () => {
  const response = await http.get('/leads');
  return response.data;
};

export const createLead = async (leadData) => {
  const response = await http.post('/leads', leadData);
  return response.data;
};

export const updateLeadStatus = async (leadId, status) => {
  const response = await http.patch(`/leads/${leadId}`, { status });
  return response.data;
};
