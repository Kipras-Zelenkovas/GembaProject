import { Router } from "express";
import {
    checkForAccessAdmin,
    checkForLogged,
} from "../middleware/accessess.js";
import { Plant } from "../../database/Models/Plant.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";
import { Area } from "../../database/Models/Area.js";
import { Line } from "../../database/Models/Line.js";
import { Process } from "../../database/Models/Process.js";
import jwt from "jsonwebtoken";
import { Office } from "../../database/Models/Office.js";

export const router = Router();

router.get("/plants", [checkForLogged], async (req, res) => {
    try {
        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        if (user.isAdmin === true) {
            const plants = await Plant.selectAll({
                exclude: ["timestamps"],
            });

            return res.status(200).json({
                status: 200,
                data: plants[0],
            });
        }

        const plants = await Plant.selectAll({
            where: {
                administrator: user.id,
            },
            exclude: ["timestamps"],
        });

        return res.status(200).json({
            status: 200,
            data: plants[0],
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});

router.get("/plant", [checkForLogged], async (req, res) => {
    try {
        const { id } = req.query;

        const plant = await Plant.findByPk({ id: id });

        return res.status(200).json({
            status: 200,
            data: plant[0],
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});

router.get("/plant/all", [checkForLogged], async (req, res) => {
    try {
        const { plant } = req.query;

        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        const plantRes = await Plant.findByPk({ id: plant });

        if (
            user.isAdmin === true ||
            plantRes[0].administrator.tb +
                ":" +
                plantRes[0].administrator.id ===
                user.id
        ) {
            const offices = await Office.selectAll({
                where: {
                    plant: plant,
                },
                exclude: ["timestamps"],
            });

            const areas = await Area.selectAll({
                where: {
                    plant: plant,
                },
                exclude: ["timestamps"],
            });

            let lines = [];

            for (let area of areas[0]) {
                const linesRes = await Line.selectAll({
                    where: {
                        area: area.id.tb + ":" + area.id.id,
                    },
                    exclude: ["timestamps"],
                });

                linesRes[0].forEach((line) => {
                    lines.push(line);
                });
            }

            let processes = [];

            for (let line of lines) {
                const processesRes = await Process.selectAll({
                    where: {
                        line: line.id.tb + ":" + line.id.id,
                    },
                    exclude: ["timestamps"],
                });

                processesRes[0].forEach((process) => {
                    processes.push(process);
                });
            }

            return res.status(200).json({
                status: 200,
                data: {
                    areas: areas[0],
                    lines: lines,
                    processes: processes,
                    offices: offices[0],
                },
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});

router.post(
    "/plant",
    [checkForLogged, checkForAccessAdmin],
    async (req, res) => {
        try {
            const { id, name, administrator } = req.body;

            const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
                algorithms: "HS512",
            });

            console.log(user);

            const plant = await Plant.findByPk({
                id: id,
            });

            if (user.isAdmin !== true) {
                return res.status(401).json({
                    status: 401,
                    message:
                        "You are not allowed to create or update this record",
                });
            }

            if (plant[0]) {
                try {
                    await Plant.update(id, {
                        name: {
                            data: name,
                            as: DataTypes.STRING,
                        },
                        administrator: {
                            data: administrator,
                            as: DataTypes.RECORD,
                        },
                    });

                    return res.status(201).json({
                        status: 201,
                        message: "Plant successfuly updated",
                    });
                } catch (error) {
                    return res.status(500).json({
                        status: 500,
                        message:
                            "Some errors accured updating record. Check all fields ( cna be an internal server error -> contact administrator )",
                    });
                }
            } else {
                try {
                    await Plant.create({
                        name: {
                            data: name,
                            as: DataTypes.STRING,
                        },
                        administrator: {
                            data: administrator,
                            as: DataTypes.RECORD,
                        },
                    });

                    return res.status(201).json({
                        status: 201,
                        message: "Plant successfuly created",
                    });
                } catch (error) {
                    return res.status(500).json({
                        status: 500,
                        message:
                            "Some errors accured creating record. Check all fields ( can be internal server error -> contact administrator )",
                    });
                }
            }
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    }
);

router.delete(
    "/plant",
    [checkForLogged, checkForAccessAdmin],
    async (req, res) => {
        try {
            const { id } = req.body;

            const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
                algorithms: "HS512",
            });

            try {
                if (user.isAdmin !== true) {
                    return res.status(401).json({
                        status: 401,
                        message: "You are not allowed to delete this record",
                    });
                }

                const areas = await Area.selectAll({
                    where: {
                        plant: id,
                    },
                });

                const offices = await Office.selectAll({
                    where: {
                        plant: id,
                    },
                });

                for (let office of offices[0]) {
                    await Office.delete(office.id.tb + ":" + office.id.id);
                }

                for (let area of areas[0]) {
                    const lines = await Line.selectAll({
                        where: {
                            area: area.id.tb + ":" + area.id.id,
                        },
                    });

                    for (let line of lines[0]) {
                        const processes = await Process.selectAll({
                            where: {
                                line: line.id.tb + ":" + line.id.id,
                            },
                        });

                        for (let process of processes[0]) {
                            await Process.delete(
                                process.id.tb + ":" + process.id.id
                            );
                        }

                        await Line.delete(line.id.tb + ":" + line.id.id);
                    }
                    await Area.delete(area.id.tb + ":" + area.id.id);
                }

                await Plant.delete(id);

                return res.status(200).json({
                    status: 200,
                    message: "Plant was successfuly deleted",
                });
            } catch (error) {
                return res.status(500).json({
                    status: 500,
                    message:
                        "Some errors accured deleting record ( contact administrator )",
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
