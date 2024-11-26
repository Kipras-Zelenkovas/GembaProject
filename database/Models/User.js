import { Surreality } from "surreality";
import { database } from "../connection.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const User = new Surreality(database, "user");

User.defineTable("SCHEMALESS", {
    name: {
        type: DataTypes.STRING,
    },
    surname: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        indexed: true,
    },
    password: {
        type: DataTypes.STRING,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
    },
    audits: {
        type: DataTypes.ARRAY,
        table: "type",
        dataType: DataTypes.RECORD,
        optional: true,
    },
    plant: {
        type: DataTypes.RECORD,
        table: "plant",
        optional: true,
    },
});
