import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskRequest } from './idea-node.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);

  private base(nodeId: number) { return `/api/idea-nodes/${nodeId}/tasks`; }

  getByNode(nodeId: number): Observable<Task[]> {
    return this.http.get<Task[]>(this.base(nodeId));
  }

  create(nodeId: number, req: TaskRequest): Observable<Task> {
    return this.http.post<Task>(this.base(nodeId), req);
  }

  toggle(nodeId: number, taskId: number): Observable<Task> {
    return this.http.patch<Task>(`${this.base(nodeId)}/${taskId}/toggle`, {});
  }

  delete(nodeId: number, taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.base(nodeId)}/${taskId}`);
  }
}
