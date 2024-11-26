import nodemailer from "nodemailer";

import {Audit} from "../../database/Models/Audit.js"
import { database } from "../../database/connection.js";



(async () => {
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

    const transporter = nodemailer.createTransport(config);

    const users = await database.query("SELECT * FROM user WHERE audit != []");

    for (const user of users[0]) {
        for(const type of user.audits){
            const auditUser = await database.query(`SELECT * FROM auditUser WHERE type = r'${type.tb + ":" + type.id}' AND user = r'${user.id.tb + ":" + user.id.id}' ORDER BY dueDate DESC LIMIT 1`);
            const audit = await Audit.findByPk({
                id: auditUser[0][0].audit.tb + ":" + auditUser[0][0].audit.id
            })

            transporter.sendMail({
                from: "info@leanteam.lt",
                to: user.email,
                subject: "Daily Reminder",
                text: `We remind you that you have an audit ( ${audit[0].name} ) due: ${audit.dueDate}. Please complete it as soon as possible. If anything is unclear, please contact Justas Meskuotis. Link here: http://localhost:3000/audits/${audit.id}`,
            });

        }   
    }

})();
