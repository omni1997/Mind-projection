import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, ProjectRequest, Ticket, TicketRequest } from './project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);
  private base = '/api/v1/projects';

  getAll(): Observable<Project[]>        { return this.http.get<Project[]>(this.base); }
  create(r: ProjectRequest)              { return this.http.post<Project>(this.base, r); }
  update(id: number, r: ProjectRequest)  { return this.http.put<Project>(`${this.base}/${id}`, r); }
  delete(id: number)                     { return this.http.delete<void>(`${this.base}/${id}`); }

  getTickets(projectId: number)          { return this.http.get<Ticket[]>(`${this.base}/${projectId}/tickets`); }
  createTicket(projectId: number, r: TicketRequest) {
    return this.http.post<Ticket>(`${this.base}/${projectId}/tickets`, r);
  }
  updateTicket(id: number, r: TicketRequest) {
    return this.http.put<Ticket>(`/api/v1/tickets/${id}`, r);
  }
  deleteTicket(id: number)               { return this.http.delete<void>(`/api/v1/tickets/${id}`); }

  linkTask(ticketId: number, taskId: number)   { return this.http.post<Ticket>(`/api/v1/tickets/${ticketId}/tasks/${taskId}`, {}); }
  unlinkTask(ticketId: number, taskId: number) { return this.http.delete<Ticket>(`/api/v1/tickets/${ticketId}/tasks/${taskId}`); }
}
