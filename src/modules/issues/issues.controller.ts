import type { Request, Response } from "express";
import { issuesService } from "./issues.service";

const createIssues = async (req: Request, res: Response) => {
  const { title, description, type } = req.body;
  try {
    const result = await issuesService.createIssuesIntoDB(req.body);
    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  const { sort = "newest", type, status } = req.query;
  const result = await issuesService.getAllIssuesFromDB();

  res.status(200).json({
    success: true,
    data: result.rows[0],
  });
};

export const issuesController = {
  createIssues,
  getAllIssues,
};
