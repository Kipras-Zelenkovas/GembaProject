import { Surreality } from "surreality";
import { database } from "../connection.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const AuditUser = new Surreality(database, "auditUser");

AuditUser.defineTable("SCHEMALESS", {
    user: {
        type: DataTypes.RECORD,
        table: "user",
    },
    audit: {
        type: DataTypes.RECORD,
        table: "audit",
    },
    type: {
        type: DataTypes.RECORD,
        table: "type",
    },
    cancelReason: {
        type: DataTypes.STRING,
        optional: true,
    },
    status: {
        type: DataTypes.STRING,
        optional: true,
    },
    dueDate: {
        type: DataTypes.DATETIME,
        optional: true,
    },
    completedDate: {
        type: DataTypes.DATETIME,
        optional: true,
    },
    transfered: {
        type: DataTypes.BOOLEAN,
        optional: true,
    },
});
