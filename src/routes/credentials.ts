import express from "express";
import { authMiddleware } from "../authMiddleware.js";
import { prismaClient } from "../db/prismaClient.js";

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

export default router;
