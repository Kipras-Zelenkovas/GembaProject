import { User } from "../../database/Models/User.js";
import { AuditUser } from "../../database/Models/AuditUser.js";
import { Audit } from "../../database/Models/Audit.js";
import { Type } from "../../database/Models/Type.js";
import { Plant } from "../../database/Models/Plant.js";
import { database } from "../../database/connection.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const weeklyAudit = async () => {
    try {
        const currentDate = new Date();

        const typesRes = await Type.selectAll();

        for (let type of typesRes[0]) {
            const lastAudit = await database.query(`
            SELECT * FROM auditUser WHERE type = ${
                type.id.tb + ":" + type.id.id
            } ORDER BY dueDate DESC LIMIT 1    
            `);

            if (lastAudit[0].length !== 0) {
                const lastAuditDate = new Date(lastAudit[0][0].dueDate);
                const difference =
                    currentDate.getTime() - lastAuditDate.getTime();
                const days = difference / (1000 * 3600 * 24);
                if (days >= 7 * type.frequency) {
                    const usersRes = await database.query(
                        `SELECT * FROM user WHERE ${
                            type.id.tb + ":" + type.id.id
                        } IN audits`
                    );

                    if (usersRes[0].length === 0) {
                        continue;
                    }

                    let availableAudits = await Audit.selectAll({
                        where: {
                            type: type.id.tb + ":" + type.id.id,
                        },
                    });

                    const lastUserAudit = await database.query(
                        `SELECT * FROM auditUser WHERE user = ${
                            usersRes[0][0].id.tb + ":" + usersRes[0][0].id.id
                        } ORDER BY date DESC LIMIT 1`
                    );

                    let index = availableAudits[0].findIndex(
                        (audit) =>
                            audit.id.tb + ":" + audit.id.id ===
                            lastUserAudit[0][0].audit.tb +
                                ":" +
                                lastUserAudit[0][0].audit.id
                    );
                    index++;

                    let date = new Date();
                    date.setDate(date.getDate() + 7 * type.frequency);
                    date.setHours(2, 0, 0, 0);

                    for (let user of usersRes[0]) {
                        if (
                            index === availableAudits[0].length - 1 ||
                            index === -1
                        ) {
                            index = 0;
                        }
                        const audit = availableAudits[0][index];
                        await AuditUser.create({
                            user: user.id.tb + ":" + user.id.id,
                            audit: audit.id.tb + ":" + audit.id.id,
                            type: type.id.tb + ":" + type.id.id,
                            dueDate: {
                                data: date.toISOString(),
                                as: DataTypes.DATETIME,
                            },
                            status: "pending",
                        });
                        index++;
                    }
                }
            } else {
                const usersRes = await database.query(
                    `SELECT * FROM user WHERE ${
                        type.id.tb + ":" + type.id.id
                    } IN audits`
                );

                if (usersRes[0].length === 0) {
                    continue;
                }

                let availableAudits = await Audit.selectAll({
                    where: {
                        type: type.id.tb + ":" + type.id.id,
                    },
                });

                const lastUserAudit = await database.query(
                    `SELECT * FROM auditUser WHERE user = ${
                        usersRes[0][0].id.tb + ":" + usersRes[0][0].id.id
                    } ORDER BY date DESC LIMIT 1`
                );

                let index = availableAudits[0].findIndex(
                    (audit) =>
                        audit.id.tb + ":" + audit.id.id ===
                        lastUserAudit[0].audit
                );

                let date = new Date();
                date.setDate(date.getDate() + 7 * type.frequency);
                date.setHours(2, 0, 0, 0);

                for (let user of usersRes[0]) {
                    if (
                        index === availableAudits[0].length - 1 ||
                        index === -1
                    ) {
                        index = 0;
                    }
                    const audit = availableAudits[0][index];
                    await AuditUser.create({
                        user: user.id.tb + ":" + user.id.id,
                        audit: audit.id.tb + ":" + audit.id.id,
                        type: type.id.tb + ":" + type.id.id,
                        dueDate: {
                            data: date.toISOString(),
                            as: DataTypes.DATETIME,
                        },
                        status: "pending",
                    });
                    index++;
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
};
