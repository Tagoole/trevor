// auth.js
export const getToken = () => {
  return localStorage.getItem('accessToken');
};

export const storeToken = (token) => {
  localStorage.setItem('accessToken', token);
};

export const clearToken = () => {
  localStorage.removeItem('accessToken');
};