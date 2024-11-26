import { Router } from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import { checkForLogged } from "../middleware/accessess.js";
import { AuditUser } from "../../database/Models/AuditUser.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";
import { User } from "../../database/Models/User.js";
import { weeklyAudit } from "../executions/weekyAudit.js";

export const router = Router();

const config = {
    host: "smtp.hostinger.com",
    port: 465,
    tls: {
        ciphers: "SSLv3",
    },
    auth: {
        user: "info@leanteam.lt",
        pass: "Kiprionikas123!",
    },
};

router.get("/user/audits", [checkForLogged], async (req, res) => {
    try {
        (() => {
            weeklyAudit();
        })();

        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        const audits = await AuditUser.selectAll({
            where: { user: user.id, status: "pending" },
            exclude: ["timestamps"],
            include: [
                {
                    relation: "audit",
                    fields: ["id", "name"],
                    include: [
                        {
                            relation: "type",
                            fields: ["name"],
                        },
                    ],
                },
            ],
        });

        return res.status(200).json({
            status: 200,
            data: audits[0],
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});

router.post("/user/audit/send", [checkForLogged], async (req, res) => {
    try {
        const { id, message, user_id } = req.body;

        const userFrom = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        const userTo = await User.findByPk({ id: user_id });

        const transporter = nodemailer.createTransport(config);

        try {
            await AuditUser.update(id, {
                user: {
                    data: user_id,
                    as: DataTypes.RECORD,
                },
                transfered: {
                    data: true,
                    as: DataTypes.BOOLEAN,
                },
            });

            transporter.sendMail({
                from: `${
                    userFrom.name + " " + userFrom.surname
                } <info@leanteam.lt>`,
                to: userTo[0].email,
                subject: "Audit transfer",
                text: message,
            });

            return res.status(200).json({
                status: 200,
                message: "Audit transfered",
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});

router.post("/user/audit/cancel", [checkForLogged], async (req, res) => {
    try {
        const { id, message } = req.body;

        try {
            await AuditUser.update(id, {
                status: {
                    data: "canceled",
                    as: DataTypes.STRING,
                },
                cancelReason: {
                    data: message,
                    as: DataTypes.STRING,
                },
            });

            return res.status(200).json({
                status: 200,
                message: "Audit transfer canceled",
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});

router.post("/user/audit/complete", [checkForLogged], async (req, res) => {
    try {
        const { id } = req.body;

        try {
            await AuditUser.update(id, {
                status: {
                    data: "completed",
                    as: DataTypes.STRING,
                },
            });

            return res.status(200).json({
                status: 200,
                message: "Audit completed",
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});
