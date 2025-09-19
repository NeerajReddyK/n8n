import { google } from "googleapis";
import express from "express";
import { prismaClient } from "../db/prismaClient.js";
import type { InputJsonValue } from "@prisma/client/runtime/library";
import { authMiddleware } from "../authMiddleware.js";

// const gmailNode = async () => {
//   try {
//     const auth = new google.auth.OAuth2(
//       process.env.OAUTH_CLIENT_ID,
//       process.env.OAUTH_CLIENT_SECRET,
//       "https://neerajreddy.dev/auth/callback"
//     );

//   } catch (error) {
//     console.error("Error gmail apis: ", error);
//   }
// };

// export default gmailNode;

const router = express.Router();

const auth = new google.auth.OAuth2(
  process.env.OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET,
  process.env.OAUTH_REDIRECT_URL
);
// /api/v1 should be added in redirect url.

router.get("/oauth_test", authMiddleware, (req, res) => {
  const scopes = ["https://www.googleapis.com/auth/gmail.send"];

  const url = auth.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    state: JSON.stringify({ email: req.email }),
  });
  console.log("email passed as state: ", req.email);
  res.redirect(url);
});

router.get("/callback", async (req, res) => {
  try {
    const code = req.query.code as string;

    const { tokens } = await auth.getToken(code);
    console.log("logging tokens: ", tokens);
    const db = await prismaClient.credentials.create({
      data: {
        title: "gmail api credentials",
        data: tokens as InputJsonValue,
        platform: "Google Gmail",
        email: req.email,
      },
    });
    auth.setCredentials(tokens);

    const gmail = google.gmail({ version: "v1", auth });
    // console.log("Logging gmail variable: ", gmail);

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

    // console.log("logging sentmail response: ", sentmail);
    res.status(200).json({
      message: "success",
      sentmail,
    });
  } catch (error) {
    res.status(500).json({ message: "error in oauth/callback", error });
  }
});

export default router;
