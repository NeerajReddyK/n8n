import type { NextFunction, Request, Response } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = localStorage.getItem("token");
    if (!auth) {
      res.status(401).json({ message: "token is not provided" });
      return;
    }
    const token = auth.split(" ")[1];
  } catch (error) {
    console.error("Error validating token: ", error);
  }
};
