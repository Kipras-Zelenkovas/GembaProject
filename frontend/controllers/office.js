import { http } from "./default.js";

export const getOffices = async (id) => {
    try {
        const res = await http.get("/offices", {
            params: {
                plant: id,
            },
        });

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};

export const CUOffice = async (data) => {
    try {
        const res = await http.post("/office", data);

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};

export const deleteOffice = async (id) => {
    try {
        const res = await http.delete(`/office/`, { data: { id: id } });

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};
