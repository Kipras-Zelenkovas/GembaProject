import { Router } from "express";
import { checkForLogged } from "../middleware/accessess.js";
import jwt from "jsonwebtoken";
import { Audit } from "../../database/Models/Audit.js";
import { Plant } from "../../database/Models/Plant.js";
import { Type } from "../../database/Models/Type.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const router = Router();

router.get("/audits", [checkForLogged], async (req, res) => {
    try {
        const { type } = req.query;

        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        const typeRes = await Type.findByPk({ id: type });

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
            const gembas = await Audit.selectAll({
                where: {
                    type: type,
                },
            });

            return res.status(200).json({
                status: 200,
                data: gembas[0],
            });
        } else {
            return res.status(400).json({
                status: 500,
                message: "You don't have any plant or access",
            });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/audit", [checkForLogged], async (req, res) => {
    try {
        const { id, name, type, location, active } = req.body;

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
            plantRes[0].administrator.tb +
                ":" +
                plantRes[0].administrator.id ===
                user.id ||
            user.isAdmin === true
        ) {
            const audit = await Audit.findByPk({ id: id });

            if (audit[0]) {
                await Audit.update(id, {
                    name: name != undefined ? name : audit[0].name,
                    type: type != undefined ? type : audit[0].type,
                    location: {
                        data:
                            location != undefined
                                ? location
                                : audit[0].location,
                        as: DataTypes.STRING,
                    },
                    active: {
                        data: active != undefined ? active : audit[0].active,
                        as: DataTypes.BOOLEAN,
                    },
                });

                return res.status(201).json({
                    status: 201,
                    message: "Audit updated",
                });
            } else {
                await Audit.create({
                    name: name,
                    type: type,
                    location: {
                        data: location,
                        as: DataTypes.STRING,
                    },
                    active: {
                        data: active,
                        as: DataTypes.BOOLEAN,
                    },
                });

                return res.status(201).json({
                    status: 201,
                    message: "Audit created",
                });
            }
        } else {
            return res.status(402).json({
                status: 402,
                message: "You don't have access to this plant",
            });
        }
    } catch (error) {
        console.log(error.message);
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error" });
    }
});

router.delete("/audit", [checkForLogged], async (req, res) => {
    try {
        const { id } = req.body;

        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        const gemba = await Audit.findByPk({ id: id });

        const type = await Type.findByPk({
            id: gemba[0].type.tb + ":" + gemba[0].type.id,
        });

        const plantRes = await Plant.findByPk({
            id: type[0].plant.tb + ":" + type[0].plant.id,
        });

        if (
            plantRes[0].administrator.tb +
                ":" +
                plantRes[0].administrator.id ===
                user.id ||
            user.isAdmin === true
        ) {
            await Audit.delete({ id: id });

            return res.status(200).json({
                status: 200,
                message: "Audit deleted",
            });
        } else {
            return res.status(402).json({
                status: 402,
                message: "You don't have access to this plant",
            });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error" });
    }
});
