import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { ObjectResponse, StatusResponse } from "../helper/responseObject";
import { jwtSecretKey } from "../config/config";
import { RequestMiddleware } from "../types";

export const getProfile = async (req: RequestMiddleware, res: Response) => {
  try {
    console.log("req", req);

    const userId = req.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      omit: {
        password: true,
      },
      include: {
        userSettings: true,
        botInstance: true,
        whatsappGroup: true,
      },
    });
    if (!user) {
      return res.status(400).json(StatusResponse(400));
    }
    return res.status(200).json(ObjectResponse(200, user, "user"));
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json(ObjectResponse(500, "Internal Server Error", "error"));
  }
};

export const InsertUserSetting = async (
  req: RequestMiddleware,
  res: Response
) => {
  try {
    const { notificationEmail, slackWebhookUrl } = req.body;
    const userId = req.userId ;
    if (!userId) {
      return res.status(400).json(StatusResponse(400));
    }
    if (!(notificationEmail || slackWebhookUrl) ) {
      return res.status(400).json(StatusResponse(400));
    }
    const result = await prisma.userSetting.create({
      data: {
        userId,
        notificationEmail,
        slackWebhookUrl,
      },
    });
    if (!result) {
      return res.status(408).json(StatusResponse(408));
    }
    return res.status(200).json(ObjectResponse(200, result?.id, "id"));
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json(ObjectResponse(500, "Internal Server error", "error"));
  }
};

export const UpdateUserSetting = async (
  req: RequestMiddleware,
  res: Response
) => {
  try {
    const { notificationEmail, slackWebhookUrl, crmType, crmApiKey, crmConfig } = req.body;
    const userId = req.userId;
    
    if (!userId) {
      return res.status(400).json(StatusResponse(400));
    }
    
    // Check if user setting exists
    const existingSettings = await prisma.userSetting.findUnique({
      where: { userId },
    });
    
    let result;
    if (existingSettings) {
      // Update existing settings
      result = await prisma.userSetting.update({
        where: { userId },
        data: {
          ...(notificationEmail !== undefined && { notificationEmail }),
          ...(slackWebhookUrl !== undefined && { slackWebhookUrl }),
          ...(crmType !== undefined && { crmType }),
          ...(crmApiKey !== undefined && { crmApiKey }),
          ...(crmConfig !== undefined && { crmConfig }),
        },
      });
    } else {
      // Create new settings if they don't exist
      result = await prisma.userSetting.create({
        data: {
          userId,
          ...(notificationEmail !== undefined && { notificationEmail }),
          ...(slackWebhookUrl !== undefined && { slackWebhookUrl }),
          ...(crmType !== undefined && { crmType }),
          ...(crmApiKey !== undefined && { crmApiKey }),
          ...(crmConfig !== undefined && { crmConfig }),
        },
      });
    }
    
    if (!result) {
      return res.status(408).json(StatusResponse(408));
    }
    
    return res.status(200).json(ObjectResponse(200, result, "userSettings"));
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json(ObjectResponse(500, "Internal Server error", "error"));
  }
};

export const AddWhatsAppGroup = async (
  req: RequestMiddleware,
  res: Response
) => {
  try {
    const { groupName } = req.body;
    const userId = req.userId;
    
    if (!userId || !groupName ) {
      return res.status(400).json(StatusResponse(400));
    }
    
    const result = await prisma.whatsAppGroup.create({
      data: {
        userId,
        groupName,
        addedAt: new Date(),
      },
    });
    
    if (!result) {
      return res.status(408).json(StatusResponse(408));
    }
    
    return res.status(200).json(ObjectResponse(200, result, "whatsappGroup"));
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json(ObjectResponse(500, "Internal Server error", "error"));
  }
};

export const UpdateWhatsAppGroup = async (
  req: RequestMiddleware,
  res: Response
) => {
  try {
    const { id, groupName, isActive } = req.body;
    const userId = req.userId;
    
    if (!userId || !id) {
      return res.status(400).json(StatusResponse(400));
    }
    
    // Check if the group exists and belongs to the user
    const existingGroup = await prisma.whatsAppGroup.findFirst({
      where: {
        id: parseInt(id),
        userId,
      },
    });
    
    if (!existingGroup) {
      return res.status(404).json(StatusResponse(404));
    }
    
    const result = await prisma.whatsAppGroup.update({
      where: { id: parseInt(id) },
      data: {
        ...(groupName !== undefined && { groupName }),
        ...(isActive !== undefined && { isActive }),
      },
    });
    
    return res.status(200).json(ObjectResponse(200, result, "whatsappGroup"));
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json(ObjectResponse(500, "Internal Server error", "error"));
  }
};

export const DeleteWhatsAppGroup = async (
  req: RequestMiddleware,
  res: Response
) => {
  try {
    const { id } = req.body;
    const userId = req.userId;
    
    if (!userId || !id) {
      return res.status(400).json(StatusResponse(400));
    }
    
    // Check if the group exists and belongs to the user
    const existingGroup = await prisma.whatsAppGroup.findFirst({
      where: {
        id: parseInt(id),
        userId,
      },
    });
    
    if (!existingGroup) {
      return res.status(404).json(StatusResponse(404));
    }
    
    await prisma.whatsAppGroup.delete({
      where: { id: parseInt(id) },
    });
    
    return res.status(200).json(StatusResponse(200));
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json(ObjectResponse(500, "Internal Server error", "error"));
  }
};

export const GetUserLeads = async (
  req: RequestMiddleware,
  res: Response
) => {
  try {
    const userId = req.userId;
    const { status, category, page = 1, limit = 10 } = req.query;
    
    if (!userId) {
      return res.status(400).json(StatusResponse(400));
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const whereClause: any = { userId };
    
    if (status) {
      whereClause.status = status;
    }
    
    if (category) {
      whereClause.category = category;
    }
    
    const [leads, totalCount] = await Promise.all([
      prisma.lead.findMany({
        where: whereClause,
        skip,
        take: Number(limit),
        orderBy: {
          id: 'desc',
        },
      }),
      prisma.lead.count({
        where: whereClause,
      }),
    ]);
    
    const totalPages = Math.ceil(totalCount / Number(limit));
    
    return res.status(200).json(
      ObjectResponse(200, {
        leads,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          totalCount,
          totalPages,
        },
      }, "data")
    );
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json(ObjectResponse(500, "Internal Server error", "error"));
  }
};
