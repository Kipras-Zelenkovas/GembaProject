import { Surreality } from "surreality";
import { database } from "../connection.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Answer = new Surreality(database, "answer");

Answer.defineTable("SCHEMALESS", {
    audit: {
        type: DataTypes.RECORD,
        table: "audit",
    },
    question: {
        type: DataTypes.RECORD,
        table: "question",
    },
    answer: {
        type: DataTypes.STRING,
    },
    additionalAnswer: {
        type: DataTypes.STRING,
        optional: true,
    },
    user: {
        type: DataTypes.RECORD,
        table: "user",
    },
    pictures: {
        type: DataTypes.ARRAY,
        dataType: DataTypes.STRING,
        optional: true,
    },
});
