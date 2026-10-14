import http from './http';

export const getMedia = async () => {
  const response = await http.get('/media');
  return response.data;
};

export const createMediaApi = async (mediaData) => {
  const response = await http.post('/media', mediaData);
  return response.data;
};

export const updateMediaApi = async (id, updatedFields) => {
  const response = await http.put(`/media/${id}`, updatedFields);
  return response.data;
};

export const deleteMediaApi = async (id) => {
  const response = await http.delete(`/media/${id}`);
  return response.data;
};
