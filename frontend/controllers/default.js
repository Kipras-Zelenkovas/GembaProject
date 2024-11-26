import axios from "axios";

export const http = axios.create({
    baseURL: "https://localhost:8080/gemba",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    rejectUnauthorized: false,
});

export const httpFile = axios.create({
    baseURL: "https://localhost:8080/gemba",
    headers: {
        "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
    rejectUnauthorized: false,
});
