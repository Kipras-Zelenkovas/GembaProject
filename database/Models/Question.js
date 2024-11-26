import { Surreality } from "surreality";
import { database } from "../connection.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Question = new Surreality(database, "question");

Question.defineTable("SCHEMALESS", {
    question: {
        type: DataTypes.STRING,
    },
    pictures: {
        type: DataTypes.ARRAY,
        dataType: DataTypes.STRING,
        optional: true,
    },
    answerType: {
        type: DataTypes.STRING,
    },
    audit: {
        type: DataTypes.RECORD,
        table: "audit",
        optional: true,
    },
    position: {
        type: DataTypes.NUMBER,
    },
    triggerPoint: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.RECORD,
        table: "type",
        optional: true,
    },
});
