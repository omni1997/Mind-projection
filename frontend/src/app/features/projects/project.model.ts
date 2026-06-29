export interface TicketRef { id: number; projectId: number; title: string; status: string; priority: string; }
export interface TaskRef   { id: number; title: string; completed: boolean; }

export interface Ticket {
  id: number;
  projectId: number;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  position: number;
  tasks: TaskRef[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  tickets: Ticket[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectRequest { name: string; description?: string | null; }
export interface TicketRequest  { title: string; description?: string | null; status?: string; priority?: string; position?: number; }

export const STATUSES: Ticket['status'][] = ['TODO', 'IN_PROGRESS', 'DONE'];
export const STATUS_LABELS: Record<string, string> = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' };
export const PRIORITY_COLORS: Record<string, string> = { LOW: '#16a34a', MEDIUM: '#d97706', HIGH: '#dc2626' };
