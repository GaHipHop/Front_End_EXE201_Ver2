import axios from "axios";

const instance = axios.create({
    baseURL: "https://gahiphop.azurewebsites.net//api/"
})

export default instance;