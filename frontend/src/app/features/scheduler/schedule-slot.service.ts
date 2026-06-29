import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScheduleSlot, ScheduleSlotRequest } from './schedule-slot.model';

@Injectable({ providedIn: 'root' })
export class ScheduleSlotService {
  private http = inject(HttpClient);
  private base = '/api/v1/schedule-slots';

  getByRange(start: Date, end: Date): Observable<ScheduleSlot[]> {
    const params = new HttpParams()
      .set('start', start.toISOString())
      .set('end', end.toISOString());
    return this.http.get<ScheduleSlot[]>(this.base, { params });
  }

  create(req: ScheduleSlotRequest): Observable<ScheduleSlot> {
    return this.http.post<ScheduleSlot>(this.base, req);
  }

  update(id: number, req: ScheduleSlotRequest): Observable<ScheduleSlot> {
    return this.http.put<ScheduleSlot>(`${this.base}/${id}`, req);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
