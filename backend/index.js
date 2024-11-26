import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import https from "https";
import DotenvFlow from "dotenv-flow";
import bodyParser from "body-parser";

import { router as authRouter } from "./controllers/authentications.js";
import { router as plantRouter } from "./controllers/plant.js";
import { router as areaRouter } from "./controllers/area.js";
import { router as lineRouter } from "./controllers/line.js";
import { router as processRouter } from "./controllers/process.js";
import { router as officeRouter } from "./controllers/office.js";
import { router as userRouter } from "./controllers/user.js";
import { router as typeRouter } from "./controllers/type.js";
import { router as auditRouter } from "./controllers/audit.js";
import { router as questionRouter } from "./controllers/questions.js";
import { router as auditUserRouter } from "./controllers/auditUser.js";
import { router as asnwerRouter } from "./controllers/answer.js";
import { router as taskRouter } from "./controllers/task.js";
import { router as chartsRouter } from "./controllers/charts.js";

DotenvFlow.config();

const app = express();

app.use(
    cors({
        origin: [process.env.DOMAIN],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static("public"));

app.use("/gemba/", [
    authRouter,
    plantRouter,
    areaRouter,
    lineRouter,
    processRouter,
    officeRouter,
    userRouter,
    typeRouter,
    auditRouter,
    questionRouter,
    auditUserRouter,
    asnwerRouter,
    taskRouter,
    chartsRouter,
]);

app.get("/test", (req, res) => {
    return res.json({ status: 200, message: "Test successful" });
});

const server = https.createServer(
    {
        key: fs.readFileSync("./certificates/key.pem"),
        cert: fs.readFileSync("./certificates/cert.crt"),
        ca: fs.readFileSync("./certificates/ca.crt"),
    },
    app
);

server.listen(process.env.PORT, async () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
