import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IdeaNode, IdeaNodeRequest } from './idea-node.model';

@Injectable({ providedIn: 'root' })
export class IdeaNodeService {
  private http = inject(HttpClient);
  private base = '/api/v1/idea-nodes';

  getTree(): Observable<IdeaNode[]> {
    return this.http.get<IdeaNode[]>(this.base);
  }

  create(req: IdeaNodeRequest): Observable<IdeaNode> {
    return this.http.post<IdeaNode>(this.base, req);
  }

  update(id: number, req: IdeaNodeRequest): Observable<IdeaNode> {
    return this.http.put<IdeaNode>(`${this.base}/${id}`, req);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
