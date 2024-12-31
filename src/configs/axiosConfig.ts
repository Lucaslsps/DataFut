import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://xxxx.herokuapp.com",
  //   baseURL: "http://localhost:8080",
});

export default axiosInstance;
