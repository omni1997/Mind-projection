export interface ScheduleSlot {
  id: number;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  recurrence: string | null;
  ideaNodeId: number | null;
  ideaNodeTitle: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleSlotRequest {
  title: string;
  description?: string | null;
  startTime: string;
  endTime: string;
  recurrence?: string | null;
  ideaNodeId?: number | null;
}
