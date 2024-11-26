import { SurrealityManager } from "surreality";

const db = new SurrealityManager(
    "http://localhost:4041",
    "gemba",
    "gemba",
    "main",
    "leangemba"
);

await db.connect();

export const database = db.getSurreal();
