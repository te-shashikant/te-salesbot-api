import express, { NextFunction, Request, Response } from "express";
import { StatusResponse } from "../helper/responseObject";
import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../config/config";
import { JwtPayloadType, RequestMiddleware } from "../types";

export const authenticationRouter = express.Router();

const authenticateToken = (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      res.status(401).json(StatusResponse(401));
      return; // Add return statement
    }

    console.log("token", token);
    const authToken = token.split(" ");

    if (authToken[0]?.toLowerCase() !== "bearer" || !authToken[1]) {
      res.status(401).json(StatusResponse(401));
      return; // Add return statement
    }

    const decodedToken = jwt.verify(
      authToken[1],
      jwtSecretKey
    ) as JwtPayloadType;

    console.log("decoded token", decodedToken);

    if (decodedToken) {
      req.userId = decodedToken.id;
      next();
    } else {
      res.status(401).json(StatusResponse(401));
    }
  } catch (error) {
    console.log("JWT verification error:", error);
    res.status(401).json(StatusResponse(401));
  }
};

// Apply middleware to the router
authenticationRouter.use(authenticateToken);
