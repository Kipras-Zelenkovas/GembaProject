import { Surreality } from "surreality";
import { database } from "../connection.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Process = new Surreality(database, "process");

Process.defineTable("SCHEMALESS", {
    name: {
        type: DataTypes.STRING,
    },
    line: {
        type: DataTypes.RECORD,
        table: "line",
    },
});
