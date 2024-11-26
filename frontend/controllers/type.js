import { http } from "./default.js";

export const getTypes = async () => {
    try {
        const res = await http.get("/types");

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};

export const CUType = async (data) => {
    try {
        const res = await http.post("/type", data);

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};

export const deleteType = async (id) => {
    try {
        const res = await http.delete(`/type`, {
            data: { id: id },
        });

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};
