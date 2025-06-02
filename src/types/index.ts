import { Request } from "express";

export interface JwtPayloadType {
  id: number;
  name?: string;
  email: string;
}

export interface RequestMiddleware extends Request {
  userId?: number;
}
