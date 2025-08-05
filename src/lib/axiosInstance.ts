// lib/axiosInstance.ts

import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`, // Ensure this is set in your .env.local file
  headers: {
    'Content-Type': 'application/json',
    'api-key': process.env.NEXT_PUBLIC_API_GATEWAY_KEY, // Add the API key here
  },
  withCredentials: true,
});




axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Ensure the API key is always included
    config.headers['api-key'] = process.env.NEXT_PUBLIC_API_GATEWAY_KEY;
    //console.log("Request Headers:", config.headers);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
// Add a response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response.status === 401) { // Unauthorized
      try {
        const refreshResponse = await axios.post('/refresh-token/', {}, {
          withCredentials: true
        });
        const newToken = refreshResponse.data.token;
        localStorage.setItem('token', newToken);
        error.config.headers['Authorization'] = `Bearer ${newToken}`;
        return axiosInstance(error.config);
      } catch (refreshError) {
        localStorage.removeItem('token');
        //  window.location.href = '/'; // Redirect to login
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
