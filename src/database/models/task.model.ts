import { taskStatus } from "../../shared/constants/taskStatus";

export interface Task {
    id?: number;
    title: string;
    description?: string;
    status: typeof taskStatus.PENDING | typeof taskStatus.IN_PROGRESS | typeof taskStatus.COMPLETED;
    user_id?: number;
    created_at?: Date;
    updated_at?: Date;
}