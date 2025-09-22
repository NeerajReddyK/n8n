import express from "express";
import { authMiddleware } from "../authMiddleware.js";
import axios from "axios";
import { prismaClient } from "../db/prismaClient.js";

const router = express.Router();

router.post("/telegram", authMiddleware, async (req, res) => {
  const email = req.email;
  const { apiToken, workflowId } = req.body;
  try {
    if (!apiToken) {
      res.status(404).json({ message: "api token not provided" });
      return;
    }

    const baseUrl = "https://api.telegram.org";
    const checkBot = `${baseUrl}/bot${apiToken}/getMe`;
    const validToken = await axios.post(checkBot);
    if (!validToken.data.ok) {
      res.status(404).json({ message: "Invalid bot api token" });
      return;
    }

    const workflow = await prismaClient.workflow.findFirst({
      where: { workflowId, email },
      select: { webhook: true },
    });
    if (!workflow) {
      res.status(404).json({ message: "unable to fetch workflow" });
      return;
    }

    const webhookId = workflow.webhook?.webhookId;
    if (!webhookId) {
      res
        .status(404)
        .json({ message: "unable to fetch webhookId from workflwo" });
      return;
    }

    const webhookUrl = `${process.env.BE_URL}/triggers/telegram/${webhookId}`;
    const telegramUrl = `${baseUrl}/bot${apiToken}/setWebhook?url=${webhookUrl}`;

    const response = await axios.post(telegramUrl);
    if (!response) {
      res
        .status(400)
        .json({ message: "unable to set webhook with telegram api" });
      return;
    }
    const db = await prismaClient.credentials.create({
      data: {
        title: "telegram",
        platform: "telegram",
        data: {
          token: apiToken,
        },
        email,
      },
    });
    if (!db) {
      res.status(500).json({ message: "prismaclient error" });
      return;
    }
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(404).json({
      message: "error while contacting telegram server with given api token",
      error,
    });
  }
});

export default router;
