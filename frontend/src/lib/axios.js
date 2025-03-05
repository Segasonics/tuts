import axios from "axios";

const axiosInstance = axios.create({
    baseURL:import.meta.mode === "development" ? 'http://localhost:8000/api/v1' : "/api/v1",
    withCredentials:true, //allows to send cookies to the server
});
console.log("Axios Base URL:", axiosInstance.defaults.baseURL);
export default axiosInstance