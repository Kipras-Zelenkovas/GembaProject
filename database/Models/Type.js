import { Surreality } from "surreality";
import { database } from "../connection.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Type = new Surreality(database, "type");

Type.defineTable("SCHEMALESS", {
    name: {
        type: DataTypes.STRING,
    },
    frequency: {
        type: DataTypes.INTEGER,
    },
    active: {
        type: DataTypes.BOOLEAN,
        optional: true,
    },
    plant: {
        type: DataTypes.RECORD,
        table: "plant",
    },
});
