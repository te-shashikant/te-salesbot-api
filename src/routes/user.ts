import express, { Express, Request, Response } from "express";
import { ObjectResponse, StatusResponse } from "../helper/responseObject";
import { LoginUser, RegisterUser } from "../controllers/authController";
const router = express.Router();

router.post("/RegisterUser", (req: Request, res: Response) => {
  try {
    RegisterUser(req, res);
  } catch (error) {
    res.status(408).json(StatusResponse(408));
  }
});

router.post("/LoginUser", (req: Request, res: Response) => {
  try {
    LoginUser(req, res);
  } catch (error) {
    res.status(408).json(StatusResponse(408));
  }
});

export default router;
