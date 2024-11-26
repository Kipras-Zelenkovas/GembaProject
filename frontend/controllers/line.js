import { http } from "./default.js";

export const getLines = async (area) => {
    try {
        const res = await http.get("/lines", {
            params: {
                area,
            },
        });

        return res.data;
    } catch (error) {
        console.error(error);
    }
};

export const CULine = async (data) => {
    try {
        const res = await http.post("/line", data);

        return res.data;
    } catch (error) {
        console.error(error);
    }
};

export const deleteLine = async (id) => {
    try {
        const res = await http.delete("/line", {
            data: {
                id: id,
            },
        });

        return res.data;
    } catch (error) {
        console.error(error);
    }
};
