import { taskSeverity } from '../../shared/constants/taskSeverity';
import { taskStatus } from '../../shared/constants/taskStatus';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: typeof taskStatus.PENDING | typeof taskStatus.IN_PROGRESS | typeof taskStatus.COMPLETED;
  user_id?: number;
  project_id: number;
  created_at?: Date;
  updated_at?: Date;
  severity?:
    | typeof taskSeverity.LOW
    | typeof taskSeverity.MEDIUM
    | typeof taskSeverity.HIGH
    | typeof taskSeverity.URGENT;
}
