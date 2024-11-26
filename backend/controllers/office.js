import { Router } from "express";
import jwt from "jsonwebtoken";
import { Office } from "../../database/Models/Office.js";
import { checkForLogged } from "../middleware/accessess.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";
import { Plant } from "../../database/Models/Plant.js";

export const router = Router();

router.get("/offices", [checkForLogged], async (req, res) => {
    try {
        const { plant } = req.query;

        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        const plantRes = await Plant.findByPk({
            id: plant,
        });

        if (
            user.isAdmin === true ||
            user.id ===
                plantRes[0].administrator.tb +
                    ":" +
                    plantRes[0].administrator.id
        ) {
            const offices = await Office.selectAll({
                where: {
                    plant: plant,
                },
                exclude: ["timestamps"],
            });

            return res.status(200).json({
                status: 200,
                data: offices[0],
            });
        }

        return res.status(403).json({
            status: 403,
            message: "You are not allowed to access this resource",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});

router.post("/office", [checkForLogged], async (req, res) => {
    try {
        const { id, name, supervisor, plant } = req.body;

        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        const office = await Office.findByPk({
            id: id,
        });

        const plantRes = await Plant.findByPk({
            id: plant,
        });

        if (
            user.isAdmin === true ||
            user.id ===
                plantRes[0].administrator.tb +
                    ":" +
                    plantRes[0].administrator.id
        ) {
            if (office[0]) {
                await Office.update(id, {
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
                    message: "Office updated",
                });
            } else {
                await Office.create({
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
                    message: "Office created",
                });
            }
        } else {
            return res.status(403).json({
                status: 403,
                message: "You are not allowed to access this resource",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});

router.delete("/office", [checkForLogged], async (req, res) => {
    try {
        const { id } = req.body;

        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        const office = await Office.findByPk({
            id: id,
        });

        const plantRes = await Plant.findByPk({
            id: office[0].plant.tb + ":" + office[0].plant.id,
        });

        if (
            user.isAdmin === true ||
            user.id ===
                plantRes[0].administrator.tb +
                    ":" +
                    plantRes[0].administrator.id
        ) {
            await Office.delete(id);

            return res.status(200).json({
                status: 200,
                message: "Office deleted",
            });
        } else {
            return res.status(403).json({
                status: 403,
                message: "You are not allowed to access this resource",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});
