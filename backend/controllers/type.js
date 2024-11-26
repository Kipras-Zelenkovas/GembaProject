import { Router } from "express";
import {
    checkForAccessAdmin,
    checkForLogged,
} from "../middleware/accessess.js";
import { Type } from "../../database/Models/Type.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";
import { Plant } from "../../database/Models/Plant.js";
import jwt from "jsonwebtoken";

export const router = Router();

router.get("/types", [checkForLogged], async (req, res) => {
    try {
        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        if (user.isAdmin === true) {
            const types = await Type.selectAll({
                exclude: ["timestamps"],
                include: [
                    {
                        relation: "plant",
                        fields: ["name", "id"],
                    },
                ],
            });

            return res.status(200).json({
                status: 200,
                data: types[0],
            });
        }

        const plantRes = await Plant.selectAll({
            where: { administrator: user.id },
            
        });

        let types = [];

        for(let plant of plantRes[0]) {
            const typesRes = await Type.selectAll({
                exclude: ["timestamps"],
                include: [
                    {
                        relation: "plant",
                        fields: ["name", "id"],
                    },
                ],
                where: {
                    plant: plant.id.tb + ":" + plant.id.id,
                },
            });


            for(let type of typesRes[0]) {
                types.push(type);
            }
        }

        return res.status(200).json({
            status: 200,
            data: types,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});

router.post("/type", [checkForLogged], async (req, res) => {
    try {
        const { id, name, frequency, active, plant } = req.body;

        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        const type = await Type.findByPk({ id });

        if (type[0]) {
            await Type.update(id, {
                name: {
                    data: name,
                    as: DataTypes.STRING,
                },
                frequency: {
                    data: frequency,
                    as: DataTypes.INTEGER,
                },
                active: {
                    data: active,
                    as: DataTypes.BOOLEAN,
                },
                plant: {
                    data: plant.id,
                    as: DataTypes.RECORD,
                },
            });

            return res.status(201).json({
                status: 201,
                message: "Type updated successfully",
            });
        } else {
            await Type.create({
                name: {
                    data: name,
                    as: DataTypes.STRING,
                },
                frequency: {
                    data: frequency,
                    as: DataTypes.INTEGER,
                },
                active: {
                    data: active,
                    as: DataTypes.BOOLEAN,
                },
                plant: {
                    data: plant,
                    as: DataTypes.RECORD,
                },
            });

            return res.status(201).json({
                status: 201,
                message: "Type created successfully",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});

router.delete(
    "/type",
    [checkForLogged],
    async (req, res) => {
        try {
            const { id } = req.body;

            const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
                algorithms: "HS512",
            });

            if (user.isAdmin === true) {
                const type = await Type.findByPk({ id });

                if (type[0]) {
                    await Type.delete(id);

                    return res.status(200).json({
                        status: 200,
                        message: "Type deleted successfully",
                    });
                }

                return res.status(404).json({
                    status: 404,
                    message: "Type not found",
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
    }
);
