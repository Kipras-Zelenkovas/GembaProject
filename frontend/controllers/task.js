import { http } from "./default.js";

export const getTasks = async () => {
    try {
        const res = await http.get("/tasks");

        return res.data;
    } catch (error) {
        console.error(error);
        return error.response.data;
    }
};

export const CUTask = async (data) => {
    try {
        const res = await http.post("/task", data);

        return res.data;
    } catch (error) {
        console.error(error);
        return error.response.data;
    }
};
