import express from "express";
import { prismaClient } from "../db/prismaClient.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const router = express.Router();

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(404).json({
        message: "Invalid credentials, provide email and password",
      });
      return;
    }
    const user = await prismaClient.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      res.status(400).json({
        message: "User not found",
      });
      return;
    }

    if (user.password !== password) {
      res.status(401).json({
        message: "Invalid credentials, email or password is wrong",
      });
      return;
    }

    const token = jwt.sign(email, process.env.JWT_SECRET!);
    if (!token) {
      console.log("Token is undefined");
      res.status(500).json({
        message: "unable to create token, jwtSecret might be undefined",
      });
      return;
    }
    res.status(200).json({
      message: "successful login",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
});

// registers a new user
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res
        .status(404)
        .json({ message: "Invalid fields, please provide email and password" });
      return;
    }

    const user = await prismaClient.user.create({
      data: {
        email,
        password,
      },
    });

    if (!user) {
      res.status(500).json({
        message: "error while creating user",
      });
      return;
    }

    const token = jwt.sign(email, process.env.JWT_SECRET!);
    res.status(200).json({
      message: "success",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server side error",
      error,
    });
  }
});

export default router;
