export interface IdeaNode {
  id: number;
  title: string;
  content: string | null;
  parentId: number | null;
  position: number;
  children: IdeaNode[];
  createdAt: string;
  updatedAt: string;
}

export interface IdeaNodeRequest {
  title: string;
  content?: string | null;
  parentId?: number | null;
  position?: number;
}
