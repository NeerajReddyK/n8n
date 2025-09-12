import express from "express";
import signRouter from "./routes/sign.js";

const app = express();
app.use(express.json());
app.use("/api/v1", signRouter);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
