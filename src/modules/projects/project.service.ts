import * as projectRepo from './project.repository';
import { Project } from '../../database/models/project.model';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';

export const createProject = async (userId: number, dto: CreateProjectDto): Promise<Project> => {
  return projectRepo.createProject({ ...dto, user_id: userId });
};

export const getProjectsByUser = async (userId: number): Promise<Project[]> => {
  return projectRepo.getProjectsByUser(userId);
};

export const getProjectById = async (id: number): Promise<Project | null> => {
  return projectRepo.getProjectById(id);
};

export const updateProject = async (id: number, dto: UpdateProjectDto): Promise<Project | null> => {
  return projectRepo.updateProject(id, dto);
};

export const deleteProject = async (id: number): Promise<void> => {
  return projectRepo.deleteProject(id);
};
