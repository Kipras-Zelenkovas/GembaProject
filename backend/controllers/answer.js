import { Router } from "express";
import jwt from "jsonwebtoken";
import * as multer from "multer";
import path from "path";
import { randomInt } from "crypto";

import { Answer } from "../../database/Models/Answer.js";
import { Question } from "../../database/Models/Question.js";
import { Task } from "../../database/Models/Task.js";
import { Type } from "../../database/Models/Type.js";
import { Audit } from "../../database/Models/Audit.js";
import { Plant } from "../../database/Models/Plant.js";
import { checkForLogged } from "../middleware/accessess.js";

export const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/answer");
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
    "/answer",
    [checkForLogged],
    upload.array("pictures[]", 20),
    async (req, res) => {
        try {
            const { answer, additionalAnswer, audit, pictures, question } =
                req.body;

            const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
                algorithms: "HS512",
            });

            const files = req.files;
            const picturesArray = files.map((file) => {
                return file.filename;
            });

            const questionRes = await Question.findByPk({ id: question });

            if (!questionRes[0]) {
                return res.status(404).json({
                    status: 404,
                    message: "Question not found",
                });
            }

            try {
                const answerRes = await Answer.create(
                    {
                        answer: answer,
                        additionalAnswer: additionalAnswer,
                        audit: audit,
                        pictures: picturesArray,
                        question: question,
                        user: user.id,
                    },
                    { return: "AFTER" }
                );

                const triggerPointType = parseInt(questionRes[0].triggerPoint);

                const auditRes = await Audit.findByPk({
                    id: audit,
                });

                const type = await Type.findByPk({
                    id: auditRes[0].type.tb + ":" + auditRes[0].type.id,
                });

                const plant = await Plant.findByPk({
                    id: type[0].plant.tb + ":" + type[0].plant.id,
                });

                if (isNaN(triggerPointType)) {
                    if (
                        questionRes[0].answerType === "text" &&
                        picturesArray.length > 0
                    ) {
                        await Task.create({
                            answer:
                                answerRes[0][0].id.tb +
                                ":" +
                                answerRes[0][0].id.id,
                            status: "unconfirmed",
                            responsible:
                                plant[0].administrator.tb +
                                ":" +
                                plant[0].administrator.id,
                        });
                    } else if (questionRes[0].triggerPoint === answer) {
                        await Task.create({
                            answer:
                                answerRes[0][0].id.tb +
                                ":" +
                                answerRes[0][0].id.id,
                            status: "unconfirmed",
                            responsible:
                                plant[0].administrator.tb +
                                ":" +
                                plant[0].administrator.id,
                        });
                    }
                } else if (!isNaN(triggerPointType)) {
                    if (questionRes[0].triggerPoint >= answer) {
                        await Task.create({
                            answer:
                                answerRes[0][0].id.tb +
                                ":" +
                                answerRes[0][0].id.id,
                            status: "unconfirmed",
                            responsible:
                                plant[0].administrator.tb +
                                ":" +
                                plant[0].administrator.id,
                        });
                    }
                }

                return res.status(200).json({
                    status: 200,
                    message: "Success",
                });
            } catch (error) {
                console.log(error.message);
                return res.status(500).json({
                    status: 500,
                    message: "Internal server error",
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    }
);
