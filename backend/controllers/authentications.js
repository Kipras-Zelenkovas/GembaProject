import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../database/Models/User.js";
import { checkForLogged } from "../middleware/accessess.js";
import { Plant } from "../../database/Models/Plant.js";

export const router = Router();

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: {
                email: email,
            },
        });

        if (user[0] === undefined) {
            return res
                .status(400)
                .json({ status: 400, message: "User does not exist" });
        }

        bcrypt.compare(password, user[0].password, (err, response) => {
            if (err) {
                return res
                    .status(400)
                    .json({ status: 400, message: "Incorrect password" });
            }

            if (response) {
                let token = jwt.sign(user[0], process.env.JSONSECRET, {
                    algorithm: "HS512",
                });

                res.cookie("token", token, {
                    httpOnly: true,
                    path: "/",
                    domain: process.env.COOKIE_DOMAIN,
                    secure: true,
                    sameSite: "none",
                    maxAge: 1000 * 60 * 60 * 24 * 30,
                });

                return res.status(200).json({
                    status: 200,
                    message: "Successfully logged in",
                    data: {
                        id: user[0].id,
                        name: `${user[0].name} ${user[0].surname}`,
                        email: user[0].email,
                    },
                });
            } else {
                return res
                    .status(400)
                    .json({ status: 400, message: "Incorrect password" });
            }
        });
    } catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error" });
    }
});

router.get("/check_cookie", async (req, res) => {
    try {
        if (req.cookies.token) {
            jwt.verify(
                req.cookies.token,
                process.env.JSONSECRET,
                { algorithms: "HS512" },
                (err, decoded) => {
                    if (err) {
                        return res
                            .status(403)
                            .json({ status: 403, message: "Invalid token" });
                    }
                    return res
                        .status(200)
                        .json({ status: 200, message: "Valid token" });
                }
            );
        } else {
            return res
                .status(403)
                .json({ status: 403, message: "No token provided" });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error" });
    }
});

router.get("/admin_access", async (req, res) => {
    try {
        if (req.cookies.token) {
            const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
                algorithms: "HS512",
            });

            let access = user.isAdmin === true ? true : false;

            if (access) {
                return res.status(200).json({
                    status: 200,
                    message: "You have the rights to perform this operation",
                });
            } else {
                return res.status(403).json({
                    errors: {
                        status: 403,
                        statusText: false,
                        message:
                            "You do not have the rights to perform this operation",
                    },
                });
            }
        } else {
            return res
                .status(403)
                .json({ status: 403, message: "No token provided" });
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});

router.get("/plant_admin", async (req, res) => {
    try {
        if (req.cookies.token) {
            const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
                algorithms: "HS512",
            });

            let plant = await Plant.findOne({
                where: {
                    administrator: user.id,
                },
            });

            let access = plant[0] === undefined ? false : true;

            let admin = user.isAdmin === true ? true : false;

            if (access || admin) {
                return res.status(200).json({
                    status: 200,
                    message: "You have the rights to perform this operation",
                });
            } else {
                return res.status(403).json({
                    errors: {
                        status: 403,
                        statusText: false,
                        message:
                            "You do not have the rights to perform this operation",
                    },
                });
            }
        } else {
            return res
                .status(403)
                .json({ status: 403, message: "No token provided" });
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});

router.post("/logout", async (req, res) => {
    try {
        if (req.cookies.token) {
            res.clearCookie("token", {
                httpOnly: true,
                path: "/",
                domain: process.env.COOKIE_DOMAIN,
                secure: true,
                sameSite: "none",
            });

            return res
                .status(200)
                .json({ status: 200, message: "Successfully logged out" });
        } else {
            return res
                .status(403)
                .json({ status: 403, message: "You are not logged in" });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error" });
    }
});

router.get("/access_level", checkForLogged, async (req, res) => {
    try {
        if (req.cookies.token) {
            const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
                algorithms: "HS512",
            });

            return res.status(200).json({
                status: 200,
                accessLevel: user.roles,
            });
        } else {
            return res
                .status(403)
                .json({ status: 403, message: "No token provided" });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error" });
    }
});
