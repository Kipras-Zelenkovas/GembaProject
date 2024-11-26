import { Router } from "express";
import { checkForLogged } from "../middleware/accessess.js";
import { Line } from "../../database/Models/Line.js";
import { Area } from "../../database/Models/Area.js";
import { Process } from "../../database/Models/Process.js";
import { Plant } from "../../database/Models/Plant.js";
import jwt from "jsonwebtoken";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const router = Router();

router.get("/lines", [checkForLogged], async (req, res) => {
    try {
        const { area } = req.query;

        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        // if (user.isAdmin === true) {
        //     const lines = await Line.selectAll();

        //     return res.status(200).json({
        //         status: 200,
        //         data: lines[0],
        //     });
        // }

        try {
            const lines = await Line.selectAll({
                where: {
                    area: area,
                },
                exclude: ["timestamps"],
            });

            return res.status(200).json({
                status: 200,
                data: lines[0],
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "Something went wrong fetching lines",
            });
        }
    } catch (error) {
        return res.status(500).json({
            errors: {
                status: 500,
                statusText: false,
                message: "Internal server error",
            },
        });
    }
});

router.post("/line", [checkForLogged], async (req, res) => {
    try {
        const { id, name, supervisor, area } = req.body;

        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        const line = await Line.findByPk({
            id: id,
        });

        const areaRes = await Area.findByPk({
            id: area,
        });

        const plantRes = await Plant.findByPk({
            id: areaRes[0].plant.tb + ":" + areaRes[0].plant.id,
        });

        if (
            user.isAdmin === true ||
            plantRes[0].administrator.tb +
                ":" +
                plantRes[0].administrator.id ===
                user.id ||
            areaRes[0].supervisor.tb + ":" + areaRes[0].supervisor.id ===
                user.id
        ) {
            if (line[0]) {
                await Line.update(id, {
                    name: {
                        data: name,
                        as: DataTypes.STRING,
                    },
                    supervisor: {
                        data: supervisor,
                        as: DataTypes.RECORD,
                    },
                    area: {
                        data: area,
                        as: DataTypes.RECORD,
                    },
                });

                return res.status(201).json({
                    status: 201,
                    message: "Line updated",
                });
            } else {
                await Line.create({
                    name: {
                        data: name,
                        as: DataTypes.STRING,
                    },
                    supervisor: {
                        data: supervisor,
                        as: DataTypes.RECORD,
                    },
                    area: {
                        data: area,
                        as: DataTypes.RECORD,
                    },
                });

                return res.status(201).json({
                    status: 201,
                    message: "Line created",
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});

router.delete("/line", [checkForLogged], async (req, res) => {
    try {
        const { id } = req.body;

        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        const line = await Line.findByPk({
            id: id,
        });

        const areaRes = await Area.findByPk({
            id: line[0].area.tb + ":" + line[0].area.id,
        });

        const plantRes = await Plant.findByPk({
            id: areaRes[0].plant.tb + ":" + areaRes[0].plant.id,
        });

        if (
            user.isAdmin === true ||
            plantRes[0].administrator.tb +
                ":" +
                plantRes[0].administrator.id ===
                user.id ||
            areaRes[0].supervisor.tb + ":" + areaRes[0].supervisor.id ===
                user.id
        ) {
            const processes = await Process.selectAll({
                where: {
                    line: id,
                },
            });

            for (let process of processes[0]) {
                await Process.delete(process.id.tb + ":" + process.id.id);
            }

            await Line.delete(id);

            return res.status(200).json({
                status: 200,
                message: "Line deleted",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});
