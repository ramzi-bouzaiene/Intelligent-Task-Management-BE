import * as dashboardRepo from './dashboard.repository';

export const getTasksThisMonth = async () => {
  return dashboardRepo.getTasksThisMonth();
};

export const getTasksLastTenDays = async () => {
  return dashboardRepo.getTasksLastTenDays();
};

export const getProjectMemberEnrolledThisMonth = async () => {
  return dashboardRepo.getProjectMemberEnrolledThisMonth();
};

export const getDevelopersEnrolledThisMonth = async () => {
  return dashboardRepo.getDevelopersEnrolledThisMonth();
};

export const getProjectThisMonth = async () => {
  return dashboardRepo.getProjectThisMonth();
};

