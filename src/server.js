import express from "express";
import pino from "pino-http";
import cors from "cors";
import cookieParser from "cookie-parser";
import contactsRouter from "./routers/contacts.js";
import authRouter from "./routers/auth.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerUi from "swagger-ui-express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const swaggerJsonPath = path.join(__dirname, "..", "docs", "swagger.json");

export const setupServer = () => {
  const app = express();
  if (fs.existsSync(swaggerJsonPath)) {
    const swaggerDocument = JSON.parse(fs.readFileSync(swaggerJsonPath, "utf8"));
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
  app.use(express.json());
  app.use(cors({ credentials: true, origin: true }));
  app.use(cookieParser());
  app.use(pino({ transport: { target: "pino-pretty" } }));
  app.use("/auth", authRouter);
  app.use("/contacts", contactsRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
