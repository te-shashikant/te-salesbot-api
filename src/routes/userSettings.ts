import express, { Express, Request, Response } from "express";
import { ObjectResponse, StatusResponse } from "../helper/responseObject";
import { 
  getProfile, 
  InsertUserSetting, 
  UpdateUserSetting,
  AddWhatsAppGroup,
  UpdateWhatsAppGroup,
  GetUserLeads,
  DeleteWhatsAppGroup
} from "../controllers/userController";
const router = express.Router();

router.get("/MyProfile", (req: Request, res: Response) => {
  try {
    // RegisterUser(req, res);
    getProfile(req, res);
  } catch (error) {
    res.status(408).json(StatusResponse(408));
  }
});

router.post("/InsertSetting", (req: Request, res: Response) => {
  try {
    InsertUserSetting(req, res);
  } catch (error) {
    res.status(408).json(StatusResponse(408));
  }
});

router.put("/UpdateSetting", (req: Request, res: Response) => {
  try {
    UpdateUserSetting(req, res);
  } catch (error) {
    res.status(408).json(StatusResponse(408));
  }
});

router.post("/WhatsAppGroup", (req: Request, res: Response) => {
  try {
    AddWhatsAppGroup(req, res);
  } catch (error) {
    res.status(408).json(StatusResponse(408));
  }
});

router.put("/WhatsAppGroup", (req: Request, res: Response) => {
  try {
    UpdateWhatsAppGroup(req, res);
  } catch (error) {
    res.status(408).json(StatusResponse(408));
  }
});

router.delete("/WhatsAppGroup", (req: Request, res: Response) => {
  try {
    DeleteWhatsAppGroup(req, res);
  } catch (error) {
    res.status(408).json(StatusResponse(408));
  }
});

router.get("/Leads", (req: Request, res: Response) => {
  try {
    GetUserLeads(req, res);
  } catch (error) {
    res.status(408).json(StatusResponse(408));
  }
});

export default router;
