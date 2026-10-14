import http from './http';

export const loginUser = async (credentials) => {
  const response = await http.post('/auth/login', credentials);
  return response.data;
};


export const signupUser = async (details) => {
  const response = await http.post('/auth/signup', details);
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await http.get('/auth/me');
  return response.data;
};
