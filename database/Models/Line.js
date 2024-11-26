import { Surreality } from "surreality";
import { database } from "../connection.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Line = new Surreality(database, "line");

Line.defineTable("SCHEMALESS", {
    name: {
        type: DataTypes.STRING,
    },
    supervisor: {
        type: DataTypes.RECORD,
        table: "user",
    },
    area: {
        type: DataTypes.RECORD,
        table: "area",
    },
});
