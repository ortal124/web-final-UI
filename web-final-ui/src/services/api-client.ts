import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
          return Promise.reject(error);
        }
  
        try {
          const { data } = await axios.post("http://localhost:3000/auth/refresh", { refreshToken });
          localStorage.setItem("accessToken", data.accessToken);
          error.config.headers.Authorization = `Bearer ${data.accessToken}`;
          return axios(error.config); 
        } catch (refreshError) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );  

export default api;
