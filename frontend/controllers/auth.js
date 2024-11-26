import axios from "axios";
import { http } from "./default.js";

export const check_cookie = async () => {
    try {
        const res = await http.get("/check_cookie");

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};

export const checkAdminAccess = async () => {
    try {
        const res = await http.get("/admin_access");

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};

export const checkPlantAdminAccess = async () => {
    try {
        const res = await http.get("/plant_admin");

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};

export const login = async (data) => {
    try {
        const res = await http.post("/login", data);

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};

export const logout = async () => {
    try {
        const res = await http.post("/logout");

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};
