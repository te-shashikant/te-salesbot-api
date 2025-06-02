import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response } from "express";
import cors from "cors";
import { authRouter, userRouter, botRouter } from "./routes";
import { authenticationRouter } from "./middleware/authentication";
const app: Express = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

/* Auth Endpoints */
app.use("/auth", authRouter);

/* User Settings */

app.use("/user", authenticationRouter, userRouter);

/* User Bots */
app.use("/bots", authenticationRouter, botRouter);

//Health Check
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to Salesbot API");
});

app.listen(8080, () => {
  console.log(`Server started at PORT 8080`);
});
