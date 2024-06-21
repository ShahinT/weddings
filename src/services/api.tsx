import axios, {AxiosInstance} from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  // You can add more default settings here
});

export default axiosInstance;