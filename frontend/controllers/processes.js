import { http } from "./default.js";

export const getProcesses = async (line) => {
    try {
        const res = await http.get(`/processes`, {
            params: {
                line: line,
            },
        });

        return res.data;
    } catch (error) {
        return error;
    }
};

export const CUProcess = async (data) => {
    try {
        const res = await http.post(`/process`, data);

        return res.data;
    } catch (error) {
        return error;
    }
};

export const deleteProcess = async (id) => {
    try {
        const res = await http.delete(`/process`, {
            data: {
                id: id,
            },
        });

        return res.data;
    } catch (error) {
        return error;
    }
};
