import { Surreality } from "surreality";
import { database } from "../connection.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Task = new Surreality(database, "task");

Task.defineTable("SCHEMALESS", {
    answer: {
        type: DataTypes.RECORD,
        table: "answer",
    },
    responsible: {
        type: DataTypes.RECORD,
        table: "user",
        optional: true,
    },
    dueDate: {
        type: DataTypes.DATETIME,
        optional: true,
    },
    actionsTaken: {
        type: DataTypes.STRING,
        optional: true,
    },
    status: {
        type: DataTypes.STRING,
        optional: true,
    },
    priority: {
        type: DataTypes.STRING,
        optional: true,
    },
    notes: {
        type: DataTypes.STRING,
        optional: true,
    },
    additionalMembers: {
        type: DataTypes.ARRAY,
        dataType: DataTypes.RECORD,
        table: "user",
        optional: true,
    },
});
