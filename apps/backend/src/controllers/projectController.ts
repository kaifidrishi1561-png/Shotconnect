import type { Request, Response, NextFunction } from 'express';
import { Project } from '../models/Project';
import { createProjectSchema } from '../validators/project';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = createProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(sendError('Validation failed', parsed.error.issues.map((issue) => issue.message)));
      return;
    }

    const project = await Project.create({
      ...parsed.data,
      brand: (req as any).user?.id,
      deadline: new Date(parsed.data.deadline as string),
      status: 'OPEN'
    });

    res.status(201).json(sendSuccess('Project created successfully', project));
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (_req: Request, res: Response) => {
  const projects = await Project.find({}).sort({ createdAt: -1 });
  res.status(200).json(sendSuccess('Projects retrieved', projects));
};
