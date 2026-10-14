import http from './http';

export const getCareers = async () => {
  const response = await http.get('/careers');
  return response.data;
};

export const createCareerApi = async (careerData) => {
  const response = await http.post('/careers', careerData);
  return response.data;
};

export const updateCareerApi = async (id, updatedFields) => {
  const response = await http.put(`/careers/${id}`, updatedFields);
  return response.data;
};

export const deleteCareerApi = async (id) => {
  const response = await http.delete(`/careers/${id}`);
  return response.data;
};
