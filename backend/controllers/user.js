import { Router } from "express";
import {
    checkForAccessAdmin,
    checkForLogged,
} from "../middleware/accessess.js";
import { User } from "../../database/Models/User.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";
import { Plant } from "../../database/Models/Plant.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { database } from "../../database/connection.js";

export const router = Router();

router.get("/users", [checkForLogged], async (req, res) => {
    try {
        const users = await User.selectAll({
            exclude: ["password", "timestamps", "email", "isAdmin"],
        });

        return res.status(200).json({ status: 200, data: users[0] });
    } catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error" });
    }
});

router.get("/users/admin", [checkForLogged], async (req, res) => {
    try {
        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        if (user.isAdmin) {
            const users = await User.selectAll({
                exclude: ["password", "timestamps"],
            });

            return res.status(200).json({ status: 200, data: users[0] });
        }

        const plant = await Plant.findOne({
            where: {
                administrator: user.id,
            },
        });

        if (plant[0]) {
            const users = await User.selectAll({
                exclude: ["password", "timestamps"],
                where: {
                    plant: plant[0].id.tb + ":" + plant[0].id.id,
                },
            });

            return res.status(200).json({ status: 200, data: users[0] });
        }

        return res.status(403).json({
            status: 403,
            message: "You don't have access to this data",
        });
    } catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error" });
    }
});

router.get("/users/audit", [checkForLogged], async (req, res) => {
    try {
        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        const usersRes = await database.query(
            `SELECT * FROM user WHERE audits != [] AND plant = ${user.plant}`
        );

        const users = usersRes[0].filter((u) => u.id != user.id);

        return res.status(200).json({ status: 200, data: users });
    } catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error" });
    }
});

router.post("/user", [checkForLogged], async (req, res) => {
    try {
        const { id, name, surname, email, password, isAdmin, plant, audits } =
            req.body;

        const user = await User.findByPk({ id: id });

        if (user[0]) {
            await User.update(id, {
                name: {
                    data:
                        name !== "" && name !== undefined ? name : user[0].name,
                    as: DataTypes.STRING,
                },
                surname: {
                    data:
                        surname !== "" && surname !== undefined
                            ? surname
                            : user[0].surname,
                    as: DataTypes.STRING,
                },
                email: {
                    data:
                        email !== "" && email !== undefined
                            ? email
                            : user[0].email,
                    as: DataTypes.STRING,
                },
                password: {
                    data:
                        password !== "" && password !== undefined
                            ? bcrypt.hashSync(password, 10)
                            : user[0].password,
                    as: DataTypes.STRING,
                },
                isAdmin: {
                    data: isAdmin != undefined ? isAdmin : user[0].isAdmin,
                    as: DataTypes.BOOLEAN,
                },
                plant: {
                    data:
                        plant !== undefined
                            ? plant
                            : user[0].plant == undefined
                            ? null
                            : user[0].plant,
                    as:
                        plant !== undefined
                            ? DataTypes.RECORD
                            : user[0].plant == undefined
                            ? DataTypes.NONE
                            : DataTypes.RECORD,
                },
                audits: {
                    data: audits !== undefined ? audits : user[0].audits,
                    dataAs: DataTypes.RECORD,
                    as: DataTypes.ARRAY,
                },
            });

            return res
                .status(201)
                .json({ status: 201, message: "User updated" });
        } else {
            await User.create({
                name: {
                    data: name,
                    as: DataTypes.STRING,
                },
                surname: {
                    data: surname,
                    as: DataTypes.STRING,
                },
                email: {
                    data: email,
                    as: DataTypes.STRING,
                },
                password: {
                    data: bcrypt.hashSync(password, 10),
                    as: DataTypes.STRING,
                },
                isAdmin: {
                    data: isAdmin,
                    as: DataTypes.BOOLEAN,
                },
                plant: {
                    data: plant,
                    as: plant !== null ? DataTypes.RECORD : DataTypes.NONE,
                },
                audits: [],
            });

            return res
                .status(201)
                .json({ status: 201, message: "User created" });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error" });
    }
});

router.delete("/user", [checkForLogged], async (req, res) => {
    try {
        const { id } = req.body;

        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        const userToDelete = await User.findByPk({ id: id });

        const plant = await Plant.findOne({
            where: {
                administrator: user.id,
            },
        });

        if (
            user.isAdmin ||
            plant[0].id.tb + ":" + plant[0].id.id == userToDelete[0].plant
        ) {
            await User.delete(id, { force: true });
            return res
                .status(200)
                .json({ status: 200, message: "User deleted" });
        }

        return res.status(403).json({
            status: 403,
            message: "You don't have access to this data",
        });
    } catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error" });
    }
});
