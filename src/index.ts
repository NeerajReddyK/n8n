import express from "express";
import signRouter from "./routes/sign.js";
import workflowRouter from "./routes/workflow.js";

const app = express();
app.use(express.json());
app.use("/api/v1", signRouter);
app.use("/api/v1/workflow", workflowRouter);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
