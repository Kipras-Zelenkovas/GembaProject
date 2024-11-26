import { httpFile } from "./default";

export const CUAnswer = async (data) => {
    try {
        const res = await httpFile.post("/answer", data);
        return res.data;
    } catch (error) {
        return error.response.data;
    }
};
