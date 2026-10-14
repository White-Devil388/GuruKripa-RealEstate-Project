import http from './http';

export const getCompanyInfo = async () => {
  const response = await http.get('/company');
  return response.data;
};

export const updateCompanyInfo = async (updatedFields) => {
  const response = await http.put('/company', updatedFields);
  return response.data;
};
