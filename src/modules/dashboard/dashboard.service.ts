import * as dashboardRepo from './dashboard.repository';

export const getDashboardData = async () => {
  return await dashboardRepo.getDashboardData();
};