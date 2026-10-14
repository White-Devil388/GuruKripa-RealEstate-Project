import http from './http';

export const getProjects = async () => {
  const response = await http.get('/projects');
  return response.data;
};

export const createProjectApi = async (projectData) => {
  const response = await http.post('/projects', projectData);
  return response.data;
};

export const updateProjectApi = async (id, updatedFields) => {
  const response = await http.put(`/projects/${id}`, updatedFields);
  return response.data;
};

export const deleteProjectApi = async (id) => {
  const response = await http.delete(`/projects/${id}`);
  return response.data;
};
