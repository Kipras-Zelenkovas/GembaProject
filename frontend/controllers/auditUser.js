import { http } from "./default.js";

export const getAuditUser = async () => {
    try {
        const res = await http.get("/user/audits");

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};

export const sendAuditUser = async (data) => {
    try {
        const res = await http.post("/user/audit/send", data);

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};

export const cancleAudit = async (data) => {
    try {
        const res = await http.post("/user/audit/cancel", data);

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};

export const completeAudit = async (id) => {
    try {
        const res = await http.post("/user/audit/complete", {
            id: id,
        });

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};
