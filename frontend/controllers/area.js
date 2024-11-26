import { http } from "./default.js";

export const getAreas = async (plant) => {
    try {
        const res = await http.get(`/areas`, {
            params: {
                plant: plant,
            },
        });

        return res.data;
    } catch (error) {
        console.error(error);
    }
};

export const CUArea = async (data) => {
    try {
        const res = await http.post("/area", data);

        return res.data;
    } catch (error) {
        console.error(error);
    }
};

export const deleteArea = async (id) => {
    try {
        const res = await http.delete(`/area`, {
            data: {
                id: id,
            },
        });

        return res.data;
    } catch (error) {
        console.error(error);
    }
};
