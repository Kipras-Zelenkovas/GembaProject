import { Router } from "express";
import { checkForLogged } from "../middleware/accessess.js";
import { Process } from "../../database/Models/Process.js";
import { Line } from "../../database/Models/Line.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";
import { Area } from "../../database/Models/Area.js";
import { Plant } from "../../database/Models/Plant.js";
import jwt from "jsonwebtoken";

export const router = Router();

router.get("/processes", [checkForLogged], async (req, res) => {
    try {
        const { line } = req.query;

        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        // if (user.isAdmin === true) {
        //     const processes = await Process.selectAll();

        //     return res.status(200).json({
        //         status: 200,
        //         data: processes[0],
        //     });
        // }

        try {
            const processes = await Process.selectAll({
                where: {
                    line: line,
                },
                exclude: ["timestamps"],
            });

            return res.status(200).json({
                status: 200,
                data: processes[0],
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "Something went wrong fetching processes",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});

router.post("/process", [checkForLogged], async (req, res) => {
    try {
        const { id, name, supervisor, line } = req.body;

        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        const processRes = await Process.findByPk({
            id: id,
        });

        const lineRes = await Line.findOne({
            where: {
                id: line,
            },
        });

        const areaRes = await Area.findOne({
            where: {
                id: lineRes[0].area.tb + ":" + lineRes[0].area.id,
            },
        });

        const plantRes = await Plant.findOne({
            where: {
                id: areaRes[0].plant.tb + ":" + areaRes[0].plant.id,
            },
        });

        if (
            user.isAdmin === true ||
            plantRes[0].administrator.tb +
                ":" +
                plantRes[0].administrator.id ===
                user.id ||
            areaRes[0].supervisor.tb + ":" + areaRes[0].supervisor.id ===
                user.id ||
            lineRes[0].supervisor.tb + ":" + lineRes[0].supervisor.id ===
                user.id
        ) {
            if (processRes[0]) {
                await Process.update(id, {
                    name: {
                        data: name,
                        as: DataTypes.STRING,
                    },
                    line: {
                        data: line,
                        as: DataTypes.RECORD,
                    },
                    supervisor: {
                        data: supervisor,
                        as: DataTypes.RECORD,
                    },
                });

                return res.status(201).json({
                    status: 201,
                    message: "Process updated",
                });
            } else {
                await Process.create({
                    name: {
                        data: name,
                        as: DataTypes.STRING,
                    },
                    line: {
                        data: line,
                        as: DataTypes.RECORD,
                    },
                    supervisor: {
                        data: supervisor,
                        as: DataTypes.RECORD,
                    },
                });

                return res.status(201).json({
                    status: 201,
                    message: "Process created",
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

router.delete("/process", [checkForLogged], async (req, res) => {
    try {
        const { id } = req.body;

        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        const processRes = await Process.findByPk({
            id: id,
        });

        const lineRes = await Line.findOne({
            where: {
                id: processRes[0].line.tb + ":" + processRes[0].line.id,
            },
        });

        const areaRes = await Area.findOne({
            where: {
                id: lineRes[0].area.tb + ":" + lineRes[0].area.id,
            },
        });

        const plantRes = await Plant.findOne({
            where: {
                id: areaRes[0].plant.tb + ":" + areaRes[0].plant.id,
            },
        });

        if (
            user.isAdmin === true ||
            plantRes[0].administrator.tb +
                ":" +
                plantRes[0].administrator.id ===
                user.id ||
            areaRes[0].supervisor.tb + ":" + areaRes[0].supervisor.id ===
                user.id ||
            lineRes[0].supervisor.tb + ":" + lineRes[0].supervisor.id ===
                user.id
        ) {
            await Process.delete(id);

            return res.status(200).json({
                status: 200,
                message: "Process deleted",
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
