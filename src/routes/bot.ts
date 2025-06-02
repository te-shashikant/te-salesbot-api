import express, { Express, Request, Response } from "express";
import { StatusResponse } from "../helper/responseObject";
import { StartBot } from "../controllers/botController";
const router = express.Router();

router.post("/Start", (req: Request, res: Response) => {
  try {
    StartBot(req, res);
  } catch (error) {
    res.status(408).json(StatusResponse(408));
  }
});

export default router;
