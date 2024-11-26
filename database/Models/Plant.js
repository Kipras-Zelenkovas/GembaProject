import { Surreality } from "surreality";
import { database } from "../connection.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Plant = new Surreality(database, "plant");

Plant.defineTable("SCHEMALESS", {
    name: {
        type: DataTypes.STRING,
    },
    administrator: {
        type: DataTypes.RECORD,
        table: "user",
    },
});
