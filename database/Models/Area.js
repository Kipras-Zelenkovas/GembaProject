import { Surreality } from "surreality";
import { database } from "../connection.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Area = new Surreality(database, "area");

Area.defineTable("SCHEMALESS", {
    name: {
        type: DataTypes.STRING,
    },
    supervisor: {
        type: DataTypes.RECORD,
        table: "user",
    },
    plant: {
        type: DataTypes.RECORD,
        table: "plant",
    },
});
