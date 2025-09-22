import { google } from "googleapis";
import express from "express";
import { prismaClient } from "../db/prismaClient.js";
import type { InputJsonValue } from "@prisma/client/runtime/library";
import jwt from "jsonwebtoken";

const router = express.Router();

const auth = new google.auth.OAuth2(
  process.env.OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET,
  process.env.OAUTH_REDIRECT_URL
);
// /api/v1 should be added in redirect url in google console and should also be changed here. and also should be moved to /validate folder

router.get("/oauth", (req, res) => {
  const token = req.query.token as string;
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(404).json({ message: "jwt-secret required to decode" });
    return;
  }
  const decoded = jwt.verify(token, secret);
  const email = decoded as string;
  const scopes = ["https://www.googleapis.com/auth/gmail.send"];

  const url = auth.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    state: email,
  });
  console.log("email passed as state: ", email);
  res.redirect(url);
});

router.get("/callback", async (req, res) => {
  console.log("logging from /callback");
  try {
    const code = req.query.code as string;
    const emailFromState = req.query.state as string;
    const { tokens } = await auth.getToken(code);
    const db = await prismaClient.credentials.create({
      data: {
        title: "gmail api credentials",
        data: tokens as InputJsonValue,
        platform: "Google Gmail",
        email: emailFromState,
      },
    });
    auth.setCredentials(tokens);

    const gmail = google.gmail({ version: "v1", auth });
    console.log("after declaring gmail");

    const emailLines = [
      "From: neerajreddy0059@gmail.com",
      "To: neerajreddykunta7@gmail.com",
      "Content-type: text/html;charset=iso-8859-1",
      "MIME-Version: 1.0",
      "Subject: Test Subject",
      "",
      "This is a test email",
    ];

    const email = emailLines.join("\r\n").trim();
    const base64Email = Buffer.from(email).toString("base64");

    const sentmail = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: base64Email,
      },
    });

    res.status(200).json({
      message: "success",
      sentmail,
    });
  } catch (error) {
    res.status(500).json({ message: "error in oauth/callback", error });
  }
});

export default router;
