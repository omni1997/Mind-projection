export interface ScheduleSlot {
  id: number;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  recurrence: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleSlotRequest {
  title: string;
  description?: string | null;
  startTime: string;
  endTime: string;
  recurrence?: string | null;
}

export type Recurrence = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
