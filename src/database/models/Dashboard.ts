import { Project } from "./project.model";
import { Task } from "./task.model";
import { User } from "./user.model";

export interface StatItem<T extends number> {
  count: T;
  badge: string;
  change: T;
}

export interface TrendDataPoint {
  date: string;
  month: string;
  value: number;
}

export interface DayDataPoint {
  date: string;
  day: string;
  value: number;
}

export interface DashboardStatistics {
  newProjects:   StatItem<Project["id"] & number>;
  newMembers:    StatItem<User["id"] & number>;
  newDevelopers: StatItem<User["id"] & number>;
  newTasks:      StatItem<Task["id"] & number>;
}

export interface DashboardTrend {
  period: string;
  data: TrendDataPoint[];
}

export interface DashboardLastTenDays {
  period: string;
  data: DayDataPoint[];
}

export interface DashboardData {
  statistics:  DashboardStatistics;
  tasksTrend:  DashboardTrend;
  lastTenDays: DashboardLastTenDays;
}