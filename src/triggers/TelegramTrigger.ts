import express from "express";
import { prismaClient } from "../db/prismaClient.js";
import { runWorkflow } from "../nodes/runWorkflow.js";

const router = express.Router();

router.post("/telegram/:webhookId", async (req, res) => {
  try {
    const webhookId = req.params.webhookId;
    const payload = req.body;
    if (!webhookId) return;

    const webhook = await prismaClient.webhook.findFirst({
      where: {
        webhookId,
      },
    });
    if (!webhook) {
      res.status(404).json({ message: "no webhook found with given Id" });
      return;
    }
    const workflowId = webhook.workflowId;
    const workflow = await prismaClient.workflow.findFirst({
      where: {
        workflowId,
      },
    });
    if (!workflow) {
      res.status(500).json({
        message: "unable to fetch workflow",
      });
      return;
    }
    const runflow = await runWorkflow(workflow, payload);
    res.status(200).json({
      message: "success",
      runflow,
    });
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
});

export default router;
