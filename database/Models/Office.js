import { Surreality } from "surreality";
import { database } from "../connection.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Office = new Surreality(database, "office");

Office.defineTable("SCHEMALESS", {
    name: {
        type: DataTypes.STRING,
    },
    plant: {
        type: DataTypes.RECORD,
        table: "plant",
    },
    supervisor: {
        type: DataTypes.RECORD,
        table: "user",
    },
});
