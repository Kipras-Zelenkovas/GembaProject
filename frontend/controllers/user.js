import { http } from "./default.js";

export const getUsersDefault = async () => {
    try {
        const res = await http.get("/users");

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};

export const getUsersAdmin = async () => {
    try {
        const res = await http.get("/users/admin");

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};

export const getUsersAudit = async () => {
    try {
        const res = await http.get("/users/audit");

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};

export const CUUser = async (data) => {
    try {
        const res = await http.post("/user", data);

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};

export const deleteUser = async (id) => {
    try {
        const res = await http.delete(`/user`, { data: { id: id } });

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};
