import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import path from "path";
import mongoose from "mongoose";
import { env } from "./config/env";

import routes from "./routes/index";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middleware/error.middleware";

const app: Application = express();

// ---- Security & core middleware ----

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header (Postman, mobile apps, native fetch)
      if (!origin) {
        callback(null, true);
        return;
      }

      // Allow localhost, 127.0.0.1, or any local Wi-Fi network IP (192.168.x.x, 10.x.x.x, 172.x.x.x)
      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin.startsWith("http://192.168.") ||
        origin.startsWith("http://10.") ||
        origin.startsWith("http://172.")
      ) {
        callback(null, true);
        return;
      }

      callback(null, true);
    },
    credentials: true,
  })
);


app.use(express.json({ limit: "2mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  })
);

app.use(mongoSanitize());


if (!env.isTest) {
  app.use(morgan(env.isProduction ? "combined" : "dev"));
}

// Rate limit auth endpoints specifically to slow down brute-force attempts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later",
    error: {
      code: "RATE_LIMITED",
    },
  },
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);

// Serve locally uploaded product images
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// ---- Health check ----

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Fashion Store API is running",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
    environment: env.NODE_ENV,
    uptime: process.uptime(),
  });
});

// ---- API routes ----

app.use("/api", routes);

// ---- 404 + error handling ----

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;