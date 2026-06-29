export interface Task {
  id: number;
  ideaNodeId: number;
  title: string;
  completed: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskRequest {
  title: string;
  completed?: boolean;
  position?: number;
}

export interface IdeaNode {
  id: number;
  title: string;
  content: string | null;
  parentId: number | null;
  position: number;
  children: IdeaNode[];
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface IdeaNodeRequest {
  title: string;
  content?: string | null;
  parentId?: number | null;
  position?: number;
}
