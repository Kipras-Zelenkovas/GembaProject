import { http, httpFile } from "./default.js";

export const getQuestions = async (audit) => {
    try {
        const res = await http.get(`/questions`, {
            params: {
                audit: audit,
            },
        });

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};

export const getTypeQuestions = async (type) => {
    try {
        const res = await http.get(`/questions_all_audits`, {
            params: {
                type: type,
            },
        });

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};

export const CUQuestion = async (data) => {
    try {
        const res = await httpFile.post(`/question`, data);

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};

export const CUQuestionType = async (data) => {
    try {
        const res = await httpFile.post(`/question_all_audits`, data);

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};

export const deleteQuestion = async (id) => {
    try {
        const res = await http.delete(`/question`, {
            data: {
                id: id,
            },
        });

        return res.data;
    } catch (error) {
        return error.response.data;
    }
};
