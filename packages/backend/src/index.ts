import express, { Request, Response } from "express";

import { PrismaClient } from '@prisma/client';

import PostRouter from "./routes/post.route";

export const prisma = new PrismaClient();

const PORT = 80;

const app = express();

app.use(express.json());

app.use("/api/v1/post", PostRouter);

// Catch unregistered routes
app.all("*", (req: Request, res: Response) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});