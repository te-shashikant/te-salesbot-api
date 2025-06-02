import express, { Express, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { ObjectResponse, StatusResponse } from "../helper/responseObject";
import { jwtSecretKey } from "../config/config";
import axiosInstance from "../config/axiosConfig";
import { RequestMiddleware } from "../types";

export const StartBot = async (req: RequestMiddleware, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json(StatusResponse(400));
    }
    const reqData = {
      userId,
      allowedGroup: [],
    };
    const result = await axiosInstance.post(`api/start`, reqData);
    return res.status(200).json(StatusResponse(200));
  } catch (error) {
    return res.status(500).json(ObjectResponse(500, "Internal", "error"));
  }
};
