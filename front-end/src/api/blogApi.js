import http from './http';

export const getBlogs = async () => {
  const response = await http.get('/blogs');
  return response.data;
};

export const createBlogApi = async (blogData) => {
  const response = await http.post('/blogs', blogData);
  return response.data;
};

export const updateBlogApi = async (id, updatedFields) => {
  const response = await http.put(`/blogs/${id}`, updatedFields);
  return response.data;
};

export const deleteBlogApi = async (id) => {
  const response = await http.delete(`/blogs/${id}`);
  return response.data;
};
