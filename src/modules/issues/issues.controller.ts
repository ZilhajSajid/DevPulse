import type { Request, Response } from "express";
import { issuesService } from "./issues.service";

const createIssues = async (req: Request, res: Response) => {
  const { title, description, type } = req.body;

  const reporter_id = req.user.id;
  const payload = {
    title,
    description,
    type,
    reporter_id,
  };
  try {
    const result = await issuesService.createIssuesIntoDB(payload);
    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: result,
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
    data: result,
  });
};

const getSingleIssue = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await issuesService.getSingleIssueFromDB(id as string);

    res.status(200).json({
      success: true,
      message: "Issue retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
};

export const issuesController = {
  createIssues,
  getAllIssues,
  getSingleIssue,
};
