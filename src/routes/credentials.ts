import express from "express";
import { authMiddleware } from "../authMiddleware.js";
import { prismaClient } from "../db/prismaClient.js";
import axios from "axios";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const email = req.email;
  // zod validation is required
  try {
    const { title, platform, data } = req.body;
    const credential = await prismaClient.credentials.create({
      data: {
        title,
        platform,
        data,
        email,
      },
    });
    res.status(200).json({
      message: "success",
      credential,
    });
  } catch (error) {
    res.status(500).json({
      message: "unable to add credentials at the moment",
      error,
    });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const email = req.email;
  try {
    const credentialId = req.params.id;
    if (!credentialId) {
      return;
    }

    const credential = await prismaClient.credentials.delete({
      where: {
        credentialId,
        email,
      },
    });

    res.status(200).json({
      message: "credentail removed successfully",
      credential,
    });
  } catch (error) {
    res.status(500).json({
      message: "unable to delete credential at the moment",
    });
  }
});

router.post("/telegram", authMiddleware, async (req, res) => {
  const email = req.email;
  try {
    const { apiToken, workflowId } = req.body;
    if (!apiToken || !workflowId) {
      res
        .status(404)
        .json({ message: "api token and workflowId are required" });
      return;
    }
    const baseUrl = "https://api.telegram.org/";
    const user = await axios.post(`${baseUrl}bot${apiToken}/getMe`);
    if (!user.data.ok) {
      res.status(404).json({
        message: "Invalid api token",
      });
      return;
    }

    // store to db
    const db = await prismaClient.credentials.create({
      data: {
        email,
        title: "Telegram Credentials",
        platform: "telegram",
        data: {
          apiToken: apiToken,
        },
      },
    });

    if (!db) {
      res.status(500).json({
        message: "Unable to write credentials to db",
      });
      return;
    }

    res.status(200).json({ success: "success", result: db });
  } catch (error) {
    res.status(500).json({
      message: "fail, unable to validate token at the moment",
      error,
    });
  }
});

export default router;
