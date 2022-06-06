import axiosInstance from "axios";

const axios = axiosInstance.create({
  baseURL: "http://localhost:4000",
});

export default axios;
