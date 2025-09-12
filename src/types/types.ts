import z from "zod";

export const enum methodType {
  POST,
  GET,
  PUT,
  DELETE,
}

export const userSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(20),
});
