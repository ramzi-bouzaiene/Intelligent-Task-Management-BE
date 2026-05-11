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

export const addMemberToProject = async (req: Request, res: Response) => {
   try {
    const projectId = Number(req.params.id);
    const { userIds } = req.body;

    await projectService.addMembersToProject(projectId, userIds);

    res.status(200).json({ message: 'Members added' });
  } catch (err) {
    res.status(400).json({ message: err });
  }
}

export const removeMemberFromProject = async (req: Request, res: Response, next: Function) => {
  try {
    const projectId = Number(req.params.id);
    const userId = Number(req.params.userId);
    await projectService.removeMemberFromProject(projectId, userId);
    res.status(200).json({ message: 'Member removed' });
  } catch (err) {
    next(err);
  }
};

export const getProjectWithMembers = async (req: Request, res: Response) => {
  const projectId = Number(req.params.id);
  const project = await projectService.getProjectWithMembers(projectId);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
};

export const getProjectsWithMembersByUser = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const projects = await projectService.getProjectsWithMembersByUser(userId);
  res.json(projects);
};