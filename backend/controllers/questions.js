import { Router } from "express";
import jwt from "jsonwebtoken";
import * as multer from "multer";
import path from "path";
import { randomInt } from "crypto";
import fs from "fs";

import { checkForLogged } from "../middleware/accessess.js";
import { Type } from "../../database/Models/Type.js";
import { Audit } from "../../database/Models/Audit.js";
import { Plant } from "../../database/Models/Plant.js";
import { Question } from "../../database/Models/Question.js";

export const router = Router();

router.get("/questions", [checkForLogged], async (req, res) => {
    try {
        const { audit } = req.query;

        const questions = await Question.selectAll({
            where: { audit: audit },
            exclude: ["timestamps"],
        });

        const sortedQuestions = questions[0].sort((a, b) => {
            return a.position - b.position;
        });

        const auditRes = await Audit.findByPk({ id: audit });

        const typeQuestions = await Question.selectAll({
            where: { type: auditRes[0].type.tb + ":" + auditRes[0].type.id },
            exclude: ["timestamps"],
        });

        const sortedTypeQuestions = typeQuestions[0].sort((a, b) => {
            return a.position - b.position;
        });

        const concated = sortedQuestions.concat(sortedTypeQuestions);

        return res.status(200).json({
            status: 200,
            message: "Success",
            data: concated,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});

router.get("/questions_all_audits", [checkForLogged], async (req, res) => {
    try {
        const { type } = req.query;

        const questions = await Question.selectAll({
            where: { type: type },
            exclude: ["timestamps"],
        });

        const sortedQuestions = questions[0].sort((a, b) => {
            return a.position - b.position;
        });

        return res.status(200).json({
            status: 200,
            message: "Success",
            data: sortedQuestions,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: 500,

            message: "Internal server error",
        });
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/question");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            Date.now() + randomInt(100000) + path.extname(file.originalname)
        );
    },
});

const upload = multer.default({ storage: storage });

router.post(
    "/question",
    [checkForLogged],
    upload.array("new_pictures[]", 20),
    async (req, res) => {
        try {
            const { id, audit, question, answerType, pictures, triggerPoint } =
                req.body;

            let trigger;
            if (answerType === "text") {
                trigger = "NONE";
            } else {
                trigger = triggerPoint;
            }

            const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
                algorithms: "HS512",
            });

            const auditRes = await Audit.findByPk({ id: audit });
            const typeRes = await Type.findByPk({
                id: auditRes[0].type.tb + ":" + auditRes[0].type.id,
            });
            const plantRes = await Plant.findByPk({
                id: typeRes[0].plant.tb + ":" + typeRes[0].plant.id,
            });

            const questions = await Question.selectAll({
                where: { audit: audit },
            });

            const position = questions[0].length + 1;

            const files = req.files;
            const new_pictures = files.map((file) => {
                return file.filename;
            });

            const questionRes = await Question.findByPk({ id: id });

            if (questionRes[0] !== undefined) {
                try {
                    const oldPictures = questionRes[0].pictures;
                    const picturesToDelete = oldPictures.filter(
                        (oldPicture) => {
                            return !pictures.includes(oldPicture);
                        }
                    );

                    picturesToDelete.forEach((picture) => {
                        fs.unlinkSync(`./public/question/${picture}`);
                    });
                } catch (error) {}
            }

            // Convert pictures to array if it's a string
            const picturesArray =
                typeof pictures === "string" ? pictures.split(",") : pictures;

            let picturesToSave =
                picturesArray != undefined && new_pictures !== undefined
                    ? picturesArray.concat(new_pictures)
                    : picturesArray != undefined && new_pictures === undefined
                    ? picturesArray
                    : new_pictures;

            picturesToSave = picturesToSave.filter((picture) => {
                return picture !== "";
            });

            if (
                user.isAdmin === true ||
                plantRes[0].administrator.tb +
                    ":" +
                    plantRes[0].administrator.id ===
                    user.id
            ) {
                if (questionRes[0] === undefined) {
                    const newQuestion = await Question.create({
                        audit: audit,
                        question: question,
                        answerType: answerType,
                        pictures: picturesToSave || [],
                        position: position,
                        triggerPoint: trigger,
                    });

                    return res.status(201).json({
                        status: 201,
                        message: "Success",
                        data: newQuestion,
                    });
                }

                const updatedQuestion = await Question.update(id, {
                    audit: audit,
                    question: question,
                    answerType: answerType,
                    pictures: picturesToSave || [],
                    position: questionRes[0].position,
                    triggerPoint: trigger,
                });

                return res.status(201).json({
                    status: 201,
                    message: "Success",
                    data: updatedQuestion,
                });
            }

            return res.status(401).json({
                status: 401,
                message: "Unauthorized access",
            });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    }
);

router.post(
    "/question_all_audits",
    [checkForLogged],
    upload.array("new_pictures[]", 20),
    async (req, res) => {
        try {
            const { id, question, answerType, pictures, triggerPoint, type } =
                req.body;

            let trigger;
            if (answerType === "text") {
                trigger = "NULL";
            } else {
                trigger = triggerPoint;
            }

            const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
                algorithms: "HS512",
            });

            const typeRes = await Type.findByPk({
                id: type,
            });
            const plantRes = await Plant.findByPk({
                id: typeRes[0].plant.tb + ":" + typeRes[0].plant.id,
            });

            if (
                user.isAdmin === true ||
                plantRes[0].administrator.tb +
                    ":" +
                    plantRes[0].administrator.id ===
                    user.id
            ) {
                const questions = await Question.selectAll({
                    where: { type },
                });

                const position = questions[0].length + 1;

                const files = req.files;
                const new_pictures = files.map((file) => {
                    return file.filename;
                });

                const questionRes = await Question.findByPk({ id: id });

                if (questionRes[0] !== undefined) {
                    try {
                        const oldPictures = questionRes[0].pictures;
                        const picturesToDelete = oldPictures.filter(
                            (oldPicture) => {
                                return !pictures.includes(oldPicture);
                            }
                        );

                        picturesToDelete.forEach((picture) => {
                            fs.unlinkSync(`./public/question/${picture}`);
                        });
                    } catch (error) {}
                }

                const picturesArray =
                    typeof pictures === "string"
                        ? pictures.split(",")
                        : pictures;

                let picturesToSave =
                    picturesArray != undefined && new_pictures !== undefined
                        ? picturesArray.concat(new_pictures)
                        : picturesArray != undefined &&
                          new_pictures === undefined
                        ? picturesArray
                        : new_pictures;

                picturesToSave = picturesToSave.filter((picture) => {
                    return picture !== "";
                });

                if (questionRes[0] === undefined) {
                    const newQuestion = await Question.create({
                        question: question,
                        answerType: answerType,
                        pictures: picturesToSave || [],
                        position: position,
                        triggerPoint: trigger,
                        type: type,
                    });

                    return res.status(201).json({
                        status: 201,
                        message: "Success",
                        data: newQuestion,
                    });
                } else {
                    const updatedQuestion = await Question.update(id, {
                        question: question,
                        answerType: answerType,
                        pictures: picturesToSave || [],
                        position: questionRes[0].position,
                        triggerPoint: trigger,
                        type: type,
                    });

                    return res.status(201).json({
                        status: 201,
                        message: "Success",
                        data: updatedQuestion,
                    });
                }
            }

            return res.status(401).json({
                status: 401,
                message: "Unauthorized access",
            });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    }
);

router.delete("/question", [checkForLogged], async (req, res) => {
    try {
        const { id } = req.body;

        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        const questionRes = await Question.findByPk({ id: id });
        const auditRes = await Audit.findByPk({
            id: questionRes[0].audit.tb + ":" + questionRes[0].audit.id,
        });
        const typeRes = await Type.findByPk({
            id: auditRes[0].type.tb + ":" + auditRes[0].type.id,
        });
        const plantRes = await Plant.findByPk({
            id: typeRes[0].plant.tb + ":" + typeRes[0].plant.id,
        });

        if (
            user.isAdmin === true ||
            plantRes[0].administrator.tb +
                ":" +
                plantRes[0].administrator.id ===
                user.id
        ) {
            const deletedQuestion = await Question.delete({ id: id });

            return res.status(200).json({
                status: 200,
                message: "Success",
                data: deletedQuestion,
            });
        }

        return res.status(401).json({
            status: 401,
            message: "Unauthorized access",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});
