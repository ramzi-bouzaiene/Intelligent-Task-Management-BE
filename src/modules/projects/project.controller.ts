import { Request, Response } from 'express';
import * as projectService from './project.service';

export const createProject = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const project = await projectService.createProject(userId, req.body);
  res.status(201).json(project);
};

export const getProjects = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const projects = await projectService.getProjectsByUser(userId);
  res.json(projects);
};

export const getProjectById = async (req: Request, res: Response) => {
  const project = await projectService.getProjectById(Number(req.params.id));
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
};

export const updateProject = async (req: Request, res: Response) => {
  const project = await projectService.updateProject(Number(req.params.id), req.body);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
};

export const deleteProject = async (req: Request, res: Response) => {
  await projectService.deleteProject(Number(req.params.id));
  res.status(204).send();
};
