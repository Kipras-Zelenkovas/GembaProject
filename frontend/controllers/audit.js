import { http } from "./default.js";

export const getAudits = async (type) => {
    try {
        const res = await http.get("/audits", {
            params: {
                type: type,
            },
        });

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};

export const CUAudit = async (data) => {
    try {
        const res = await http.post("/audit", data);

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};

export const deleteAudit = async (id) => {
    try {
        const res = await http.delete(`/audit`, { data: { id: id } });

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};
