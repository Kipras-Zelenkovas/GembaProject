import { Surreality } from "surreality";
import { database } from "../connection.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Audit = new Surreality(database, "audit");

Audit.defineTable("SCHEMALESS", {
    name: {
        type: DataTypes.STRING,
    },
    location: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.RECORD,
        table: "type",
    },
    active: {
        type: DataTypes.BOOLEAN,
        optional: true,
    },
});
