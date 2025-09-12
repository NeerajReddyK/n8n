import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(404).json({
        message: "token is undefined",
      });
      return;
    }
    const jwtToken = token.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({
        message: "undefined jwtSecret",
      });
      return;
    }
    const decoded = jwt.verify(jwtToken!, secret);
    if (!decoded) {
      res.status(400).json({
        message: "Invalid user",
      });
      return;
    }
    req.email = decoded as string;

    next();
  } catch (error) {
    console.error("Error validating token: ", error);
  }
};
