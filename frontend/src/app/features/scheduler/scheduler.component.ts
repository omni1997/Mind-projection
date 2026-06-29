import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FloorPipe } from '../../shared/floor.pipe';
import { ScheduleSlotService } from './schedule-slot.service';
import { ScheduleSlot, ScheduleSlotRequest } from './schedule-slot.model';

interface SlotForm {
  title: string;
  description: string;
  date: string;
  startHour: number;
  endHour: number;
  recurrence: string;
}

interface CalendarSlot {
  slot: ScheduleSlot;
  dayIndex: number;
  startRow: number;
  rowSpan: number;
}

@Component({
  selector: 'app-scheduler',
  standalone: true,
  imports: [CommonModule, FormsModule, FloorPipe],
  templateUrl: './scheduler.component.html',
  styleUrl: './scheduler.component.scss'
})
export class SchedulerComponent implements OnInit {
  private svc = inject(ScheduleSlotService);

  weekStart   = signal(this.getMonday(new Date()));
  slots       = signal<ScheduleSlot[]>([]);
  showForm    = signal(false);
  editingId   = signal<number | null>(null);
  loading     = signal(false);

  form: SlotForm = this.emptyForm();

  hours = Array.from({ length: 24 }, (_, i) => i);

  weekDays = computed(() => {
    const monday = this.weekStart();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  });

  weekLabel = computed(() => {
    const days = this.weekDays();
    const fmt = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    return `${fmt(days[0])} – ${fmt(days[6])} ${days[0].getFullYear()}`;
  });

  calendarSlots = computed<CalendarSlot[]>(() => {
    const days = this.weekDays();
    return this.slots().flatMap(slot => {
      const start = new Date(slot.startTime);
      const end   = new Date(slot.endTime);
      const dayIndex = days.findIndex(d => this.sameDay(d, start));
      if (dayIndex === -1) return [];
      const startRow = start.getHours() * 2 + (start.getMinutes() >= 30 ? 1 : 0);
      const endRow   = end.getHours()   * 2 + (end.getMinutes()   >  0  ? 1 : 0);
      return [{ slot, dayIndex, startRow, rowSpan: Math.max(1, endRow - startRow) }];
    });
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    const days = this.weekDays();
    const start = new Date(days[0]); start.setHours(0, 0, 0, 0);
    const end   = new Date(days[6]); end.setHours(23, 59, 59, 999);
    this.svc.getByRange(start, end).subscribe({
      next: s => { this.slots.set(s); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  prevWeek() { this.weekStart.update(d => { const n = new Date(d); n.setDate(d.getDate() - 7); return n; }); this.load(); }
  nextWeek() { this.weekStart.update(d => { const n = new Date(d); n.setDate(d.getDate() + 7); return n; }); this.load(); }
  goToday()  { this.weekStart.set(this.getMonday(new Date())); this.load(); }

  openCreate(dayIndex?: number, hour?: number) {
    this.form = this.emptyForm();
    if (dayIndex !== undefined && hour !== undefined) {
      const day = this.weekDays()[dayIndex];
      this.form.date = this.toDateInput(day);
      this.form.startHour = hour;
      this.form.endHour   = Math.min(hour + 1, 23);
    }
    this.editingId.set(null);
    this.showForm.set(true);
  }

  openEdit(slot: ScheduleSlot) {
    const start = new Date(slot.startTime);
    const end   = new Date(slot.endTime);
    this.form = {
      title: slot.title,
      description: slot.description ?? '',
      date: this.toDateInput(start),
      startHour: start.getHours(),
      endHour: end.getHours() || 23,
      recurrence: slot.recurrence ?? 'NONE'
    };
    this.editingId.set(slot.id);
    this.showForm.set(true);
  }

  save() {
    if (!this.form.title.trim() || !this.form.date) return;
    const req = this.buildRequest();
    const id = this.editingId();
    const obs = id ? this.svc.update(id, req) : this.svc.create(req);
    obs.subscribe(() => { this.showForm.set(false); this.load(); });
  }

  deleteSlot(id: number) {
    this.svc.delete(id).subscribe(() => this.load());
  }

  cancel() { this.showForm.set(false); }

  slotsForCell(dayIndex: number, hour: number): CalendarSlot[] {
    return this.calendarSlots().filter(cs => cs.dayIndex === dayIndex && cs.startRow === hour * 2);
  }

  isToday(d: Date): boolean { return this.sameDay(d, new Date()); }

  formatHour(h: number): string { return `${String(h).padStart(2, '0')}:00`; }

  private buildRequest(): ScheduleSlotRequest {
    const [y, m, d] = this.form.date.split('-').map(Number);
    const start = new Date(y, m - 1, d, this.form.startHour, 0);
    const end   = new Date(y, m - 1, d, this.form.endHour,   0);
    return {
      title: this.form.title.trim(),
      description: this.form.description || null,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      recurrence: this.form.recurrence === 'NONE' ? null : this.form.recurrence
    };
  }

  private emptyForm(): SlotForm {
    return { title: '', description: '', date: this.toDateInput(new Date()), startHour: 9, endHour: 10, recurrence: 'NONE' };
  }

  private getMonday(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay();
    const diff = (day === 0 ? -6 : 1 - day);
    date.setDate(date.getDate() + diff);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private sameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  private toDateInput(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
