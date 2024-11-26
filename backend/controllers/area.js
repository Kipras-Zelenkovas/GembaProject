import { Router } from "express";
import { checkForLogged } from "../middleware/accessess.js";
import jwt from "jsonwebtoken";
import { Area } from "../../database/Models/Area.js";
import { Plant } from "../../database/Models/Plant.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";
import { Line } from "../../database/Models/Line.js";
import { Process } from "../../database/Models/Process.js";

export const router = Router();

router.get("/areas", [checkForLogged], async (req, res) => {
    try {
        const { plant } = req.query;

        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        const plantRes = await Plant.findOne({
            where: {
                id: plant,
            },
        });

        try {
            if (
                user.isAdmin === true ||
                plantRes[0].administrator.tb +
                    ":" +
                    plantRes[0].administrator.id ===
                    user.id
            ) {
                const areas = await Area.selectAll({
                    where: {
                        plant: plant,
                    },
                });

                return res.status(200).json({
                    status: 200,
                    data: areas[0],
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "Something went wrong fetching areas",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});

router.post("/area", [checkForLogged], async (req, res) => {
    try {
        const { id, name, supervisor, plant } = req.body;

        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        const area = await Area.findByPk({
            id: id,
        });

        const plantRes = await Plant.findOne({
            where: {
                id: plant,
            },
        });

        if (
            user.isAdmin === true ||
            plantRes[0].supervisor.tb + ":" + plantRes[0].supervisor.id ===
                user.id
        ) {
            if (area[0]) {
                await Area.update(id, {
                    name: {
                        data: name,
                        as: DataTypes.STRING,
                    },
                    supervisor: {
                        data: supervisor,
                        as: DataTypes.RECORD,
                    },
                    plant: {
                        data: plant,
                        as: DataTypes.RECORD,
                    },
                });

                return res.status(201).json({
                    status: 201,
                    message: "Area updated",
                });
            } else {
                await Area.create({
                    name: {
                        data: name,
                        as: DataTypes.STRING,
                    },
                    supervisor: {
                        data: supervisor,
                        as: DataTypes.RECORD,
                    },
                    plant: {
                        data: plant,
                        as: DataTypes.RECORD,
                    },
                });

                return res.status(201).json({
                    status: 201,
                    message: "Area created",
                });
            }
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});

router.delete("/area", [checkForLogged], async (req, res) => {
    try {
        const { id } = req.body;

        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        const area = await Area.findByPk({
            id: id,
        });

        const plant = await Plant.findByPk({
            id: area[0].plant.tb + ":" + area[0].plant.id,
        });

        if (
            user.isAdmin === true ||
            plant[0].administrator.tb + ":" + plant[0].administrator.id ===
                user.id
        ) {
            const lines = await Line.selectAll({
                where: {
                    area: id,
                },
            });

            for (let line of lines[0]) {
                const processes = await Process.selectAll({
                    where: {
                        line: line.id.tb + ":" + line.id.id,
                    },
                });

                for (let process of processes[0]) {
                    await Process.delete(process.id.tb + ":" + process.id.id);
                }

                await Line.delete(line.id.tb + ":" + line.id.id);
            }

            await Area.delete(id);

            return res.status(200).json({
                status: 200,
                message: "Area deleted",
            });
        }

        return res.status(403).json({
            status: 403,
            message: "You don't have permission to delete this area",
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});
