import { google } from "googleapis";
import { type Credentials } from "google-auth-library";
import { prismaClient } from "../db/prismaClient.js";

const runNode = async (node: any, inputData: any, email: string) => {
  switch (node.type) {
    case "telegramTrigger":
      return inputData;
    case "gmailAction":
      const credentials = await prismaClient.credentials.findFirst({
        where: {
          email,
          platform: "Google Gmail",
        },
        select: { data: true },
      });
      if (!credentials) {
        console.error("gmail oauth not completed");
        return;
      }
      const tokens = credentials.data as Credentials;

      const auth = new google.auth.OAuth2(
        process.env.OAUTH_CLIENT_ID,
        process.env.OAUTH_CLIENT_SECRET,
        process.env.OAUTH_REDIRECT_URL
      );
      auth.setCredentials(tokens);
      const gmail = google.gmail({ version: "v1", auth });
      const emailLines = [
        "From: neerajreddy0059@gmail.com",
        "To: neerajreddykunta7@gmail.com",
        "Content-type: text/html;charset=iso-8859-1",
        "MIME-Version: 1.0",
        "Subject: Automated Subject",
        "",
        "This is an automated email",
      ];

      const emaildata = emailLines.join("\r\n").trim();
      const base64Email = Buffer.from(emaildata).toString("base64");

      await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: base64Email,
        },
      });
      break;
    default:
      console.log("can't find this type of node", node.type);
      break;
  }
};

export default runNode;
