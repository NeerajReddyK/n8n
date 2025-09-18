import express from "express";
import signRouter from "./routes/sign.js";
import workflowRouter from "./routes/workflow.js";
import credentialsRouter from "./routes/credentials.js";
import telegramRouter from "./triggers/TelegramTrigger.js";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
app.use("/api/v1", signRouter);
app.use("/api/v1/workflow", workflowRouter);
app.use("/api/v1/credentials", credentialsRouter);
app.use("/api/v1/triggers", telegramRouter);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
