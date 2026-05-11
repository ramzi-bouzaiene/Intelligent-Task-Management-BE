import * as projectRepo from './project.repository';
import { Project } from '../../database/models/project.model';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import {
  buildPaginatedResponse,
  getPagination,
  PaginatedResponse,
  PaginationParams,
} from '../../shared/utils/pagination';

export const createProject = async (userId: number, dto: CreateProjectDto): Promise<Project> => {
  return projectRepo.createProject({ ...dto, user_id: userId });
};

export const getProjectsByUser = async (
  userId: number,
  pagination: PaginationParams = {},
): Promise<PaginatedResponse<Project>> => {
  const { page, limit, offset } = getPagination(pagination.page, pagination.limit);
  const { rows, total } = await projectRepo.getProjectsByUser(userId, limit, offset);
  return buildPaginatedResponse(rows, total, page, limit);
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

export const addMembersToProject = async (projectId: number, userIds: number[]): Promise<void> => {
  return projectRepo.addMemberToProject(projectId, userIds);
};

export const removeMemberFromProject = async (projectId: number, userId: number): Promise<void> => {
  return projectRepo.removeMemberFromProject(projectId, userId);
}

export const getProjectWithMembers = async (projectId: number) => {
  return projectRepo.getProjectWithMembers(projectId);
};

export const getProjectsWithMembersByUser = async (
  userId: number,
  pagination: PaginationParams = {},
) => {
  const { page, limit, offset } = getPagination(pagination.page, pagination.limit);
  const { rows, total } = await projectRepo.getProjectsWithMembersByUser(
    userId,
    limit,
    offset,
  );
  return buildPaginatedResponse(rows, total, page, limit);
};