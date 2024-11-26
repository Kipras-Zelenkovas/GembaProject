import { http } from "./default.js";

export const getDistributed = async (plant) => {
    try {
        const res = await http.get(`/charts/distributed`);

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};
