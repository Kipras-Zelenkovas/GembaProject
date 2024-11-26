import { http } from "./default.js";

export const getPlants = async () => {
    try {
        const res = await http.get("/plants");

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};

export const getPlantAll = async (id) => {
    try {
        const res = await http.get("/plant/all", {
            params: {
                plant: id,
            },
        });

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};

export const CUPlant = async (data) => {
    try {
        const res = await http.post("/plant", data);

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};

export const deletePlant = async (id) => {
    try {
        const res = await http.delete("/plant", { data: { id } });

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};
