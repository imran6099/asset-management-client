import axios from 'axios';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API || 'https://local-asset-management.herokuapp.com/v1/',
});

axios.defaults.headers.post['Access-Control-Allow-Origin'] = true;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
