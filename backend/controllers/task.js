import { Router } from "express";
import jwt from "jsonwebtoken";

import { checkForLogged } from "../middleware/accessess.js";
import { Task } from "../../database/Models/Task.js";
import { database } from "../../database/connection.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";
import { Plant } from "../../database/Models/Plant.js";

export const router = Router();

router.get("/tasks", [checkForLogged], async (req, res) => {
    try {
        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        const plant = await Plant.findOne({
            where: {
                administrator: user.id,
            },
        });

        if (plant[0] || user.isAdmin) {
            let tasks = await database.query(`
            SELECT *, answer.*, answer.audit.*, answer.user.name, answer.user.surname OMIT timestamps, answer.timestamps, answer.audit.timestamps FROM task;  
        `);

            for (let task of tasks[0]) {
                const location = await database.query(
                    `SELECT * FROM r'${task.answer.audit.location}';`
                );

                task.location = location[0][0].name;
            }
            return res.status(200).json({
                status: 200,
                data: tasks[0],
            });
        } else {
            let tasks = await database.query(`
            SELECT *, answer.*, answer.audit.*, answer.user.name, answer.user.surname OMIT timestamps, answer.timestamps, answer.audit.timestamps FROM task WHERE ${user.id} IN additionalMembers OR responsible = ${user.id} AND status != "unconfirmed" AND status != "rejected";  
        `);

            for (let task of tasks[0]) {
                const location = await database.query(
                    `SELECT * FROM r'${task.answer.audit.location}';`
                );

                task.location = location[0][0].name;
            }
            return res.status(200).json({
                status: 200,
                data: tasks[0],
            });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});

router.post("/task", [checkForLogged], async (req, res) => {
    try {
        const {
            id,
            actionsTaken,
            additionalMembers,
            answer,
            dueDate,
            notes,
            priority,
            responsible,
            status,
        } = req.body;

        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        const taskRes = await Task.findByPk({ id: id });

        if (taskRes[0] === undefined) {
            return res.status(404).json({
                status: 404,
                message: "Task not found",
            });
        }

        await Task.update(id, {
            actionsTaken: {
                data:
                    actionsTaken != undefined
                        ? actionsTaken
                        : taskRes[0].actionsTaken != undefined
                        ? taskRes[0].actionsTaken
                        : "",
                as:
                    DataTypes.STRING != undefined
                        ? DataTypes.STRING
                        : taskRes[0].actionsTaken != undefined
                        ? DataTypes.STRING
                        : DataTypes.NONE,
            },
            additionalMembers: {
                data: additionalMembers != undefined ? additionalMembers : [],
                as: DataTypes.ARRAY,
                dataAs: DataTypes.RECORD,
            },
            answer: {
                data: answer,
                as: DataTypes.RECORD,
            },
            dueDate: {
                data: dueDate,
                as: DataTypes.DATETIME,
            },
            notes: {
                data:
                    notes !== undefined
                        ? notes
                        : taskRes[0].notes !== undefined
                        ? taskRes[0].notes
                        : "",
                as:
                    DataTypes.STRING !== undefined
                        ? DataTypes.STRING
                        : taskRes[0].notes !== undefined
                        ? DataTypes.STRING
                        : DataTypes.NONE,
            },
            priority: {
                data: priority,
                as: DataTypes.STRING,
            },
            responsible: {
                data: responsible,
                as: DataTypes.RECORD,
            },
            status: {
                data: status,
                as: DataTypes.STRING,
            },
        });

        return res.status(200).json({
            status: 200,
            message: "Task updated",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});
