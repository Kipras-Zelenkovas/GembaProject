import { Router } from "express";
import { checkForLogged } from "../middleware/accessess.js";
import jwt from "jsonwebtoken";

import { Type } from "../../database/Models/Type.js";
import { database } from "../../database/connection.js";

export const router = Router();

router.get("/charts/distributed", [checkForLogged], async (req, res) => {
    try {
        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        const typesRes = await Type.selectAll({
            where: {
                plant: user.plant,
            },
        });

        let distributed = [];

        let firstDayWeek = new Date();
        let day = firstDayWeek.getDay(),
            diff = firstDayWeek.getDate() - day + (day == 0 ? -6 : 1);
        firstDayWeek.setDate(diff);
        firstDayWeek.setHours(2, 0, 0, 0);

        let curr = new Date(firstDayWeek);
        let lastDayWeek = new Date(
            curr.setDate(curr.getDate() - curr.getDay() + 8)
        );
        lastDayWeek.setHours(2, 0, 0, 0);

        let yearStart = new Date(new Date().getFullYear(), 0, 1);
        yearStart.setHours(2, 0, 0, 0);
        let yearEnd = new Date(new Date().getFullYear() + 1, 0, 1);
        yearEnd.setHours(2, 0, 0, 0);

        for (let type of typesRes[0]) {
            const auditsDistributed = await database.query(
                `RETURN count(SELECT * FROM auditUser WHERE dueDate >= d'${firstDayWeek.toISOString()}' AND dueDate <= d'${lastDayWeek.toISOString()}' AND type = ${
                    type.id
                })`
            );

            const auditsDone = await database.query(
                `RETURN count(SELECT * FROM auditUser WHERE dueDate >= d'${firstDayWeek.toISOString()}' AND dueDate <= d'${lastDayWeek.toISOString()}' AND type = ${
                    type.id
                } AND status = 'completed')`
            );

            distributed.push({
                name: type.name.trim(),
                distributed: auditsDistributed[0],
                done: auditsDone[0],
            });
        }

        const tasksThisWeek = await database.query(
            `RETURN count(SELECT * FROM task WHERE timestamps.created_at >= d'${firstDayWeek.toISOString()}' AND timestamps.created_at <= d'${lastDayWeek.toISOString()}' AND status != 'unconfirmed' AND status != 'rejected')`
        );

        firstDayWeek.setDate(diff - 7);
        lastDayWeek.setDate(diff - 7);
        const tasksLastWeek = await database.query(
            `RETURN count(SELECT * FROM task WHERE timestamps.created_at >= d'${firstDayWeek.toISOString()}' AND timestamps.created_at <= d'${lastDayWeek.toISOString()}' AND status != 'unconfirmed' AND status != 'rejected')`
        );

        firstDayWeek.setDate(diff - 7);
        lastDayWeek.setDate(diff - 7);
        const tasks2WeeksAgo = await database.query(
            `RETURN count(SELECT * FROM task WHERE timestamps.created_at >= d'${firstDayWeek.toISOString()}' AND timestamps.created_at <= d'${lastDayWeek.toISOString()}' AND status != 'unconfirmed' AND status != 'rejected')`
        );

        firstDayWeek.setDate(diff - 7);
        lastDayWeek.setDate(diff - 7);
        const tasks3WeeksAgo = await database.query(
            `RETURN count(SELECT * FROM task WHERE timestamps.created_at >= d'${firstDayWeek.toISOString()}' AND timestamps.created_at <= d'${lastDayWeek.toISOString()}' AND status != 'unconfirmed' AND status != 'rejected')`
        );

        const tasksYear = await database.query(
            `RETURN count(SELECT * FROM task WHERE timestamps.created_at >= d'${yearStart.toISOString()}' AND timestamps.created_at <= d'${yearEnd.toISOString()}' AND status != 'unconfirmed' AND status != 'rejected')`
        );

        const tasksYearCompleted = await database.query(
            `RETURN count(SELECT * FROM task WHERE timestamps.created_at >= d'${yearStart.toISOString()}' AND timestamps.created_at <= d'${yearEnd.toISOString()}' AND status = 'completed')`
        );

        let currentMonth = new Date();
        currentMonth.setHours(2, 0, 0, 0);
        let nextMonth = new Date(currentMonth);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextMonth.setHours(2, 0, 0, 0);

        const currentMonthTasks = await database.query(
            `RETURN count(SELECT * FROM task WHERE timestamps.created_at >= d'${currentMonth.toISOString()}' AND timestamps.created_at <= d'${nextMonth.toISOString()}' AND status != 'unconfirmed' AND status != 'rejected')`
        );

        const currentMonthCompletedTasks = await database.query(
            `RETURN count(SELECT * FROM task WHERE timestamps.created_at >= d'${currentMonth.toISOString()}' AND timestamps.created_at <= d'${nextMonth.toISOString()}' AND status = 'completed')`
        );

        return res.status(200).json({
            status: 200,
            data: distributed,
            tasks: [
                {
                    name: "This week",
                    value: tasksThisWeek[0],
                },
                {
                    name: "Last week",
                    value: tasksLastWeek[0],
                },
                {
                    name: "2 weeks ago",
                    value: tasks2WeeksAgo[0],
                },
                {
                    name: "3 weeks ago",
                    value: tasks3WeeksAgo[0],
                },
                {
                    name: "Current month",
                    value: currentMonthTasks[0],
                },
                {
                    name: "Current month completed",
                    value: currentMonthCompletedTasks[0],
                },
                {
                    name: "Year",
                    value: tasksYear[0],
                },
                {
                    name: "Year completed",
                    value: tasksYearCompleted[0],
                },
            ],
        });
    } catch (error) {
        console.log(error.message);

        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});
