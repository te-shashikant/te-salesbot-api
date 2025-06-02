import express, { Express, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { ObjectResponse, StatusResponse } from "../helper/responseObject";
import { jwtSecretKey } from "../config/config";

export const RegisterUser = async (req: Request, res: Response) => {
  try {
    console.log("body", req.body);
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json(StatusResponse(400));
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(200).json(StatusResponse(205));
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    if (hashedPassword) {
      const result = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });
      if (result.id) {
        res.status(200).json(ObjectResponse(200, result?.id, "id"));
      } else {
        res.status(408).json(StatusResponse(408));
      }
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json(StatusResponse(500));
  }
};

export const LoginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(StatusResponse(400));
    }

    const userData = await prisma.user.findUnique({
      where: { email },
    });

    if (!userData) {
      return res.status(200).json(StatusResponse(203));
    }

    if (userData?.isActive) {
      const isPassowrdCorrect = await bcrypt.compare(
        req?.body?.password,
        userData?.password
      );
      if (isPassowrdCorrect) {
        const payload = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
        };
        const expireTime = req.body.rememberMe ? "30d" : "1d";
        const generatedToken = jwt.sign(payload, jwtSecretKey, {
          expiresIn: expireTime,
        });
        return res
          .status(200)
          .json(ObjectResponse(200, generatedToken, "token"));
      }
      return res.status(200).json(StatusResponse(202));
    }
    return res.status(200).json(StatusResponse(204));
  } catch (error: any) {
    console.log("error", error);
    return res.status(500).json(ObjectResponse(500, error?.message, "error"));
  }
};
