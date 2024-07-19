import axios from "axios";

const instance = axios.create({
    baseURL: "https://localhost:7068/api/"
})

export default instance;