import express from "express";
import signRouter from "./routes/sign.js";
import workflowRouter from "./routes/workflow.js";
import credentialsRouter from "./routes/credentials.js";

const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use("/api/v1", signRouter);
app.use("/api/v1/workflow", workflowRouter);
app.use("/api/v1/credentials", credentialsRouter);

app.listen(3000, () => {
  console.log(`Listening on port: ${PORT}`);
});
