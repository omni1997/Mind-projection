import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FloorPipe } from '../../shared/floor.pipe';
import { ScheduleSlotService } from './schedule-slot.service';
import { ScheduleSlot, ScheduleSlotRequest } from './schedule-slot.model';
import { IdeaNodeService } from '../idea-tree/idea-node.service';
import { IdeaNode } from '../idea-tree/idea-node.model';

interface SlotForm {
  title: string;
  description: string;
  date: string;
  startHour: number;
  endHour: number;
  recurrence: string;
  ideaNodeId: number | null;
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
  private svc     = inject(ScheduleSlotService);
  private ideaSvc = inject(IdeaNodeService);
  private route   = inject(ActivatedRoute);

  weekStart  = signal(this.getMonday(new Date()));
  slots      = signal<ScheduleSlot[]>([]);
  ideaNodes  = signal<IdeaNode[]>([]);
  showForm   = signal(false);
  editingId  = signal<number | null>(null);
  loading    = signal(false);

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
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    return `${fmt(days[0])} – ${fmt(days[6])} ${days[0].getFullYear()}`;
  });

  calendarSlots = computed<CalendarSlot[]>(() => {
    const days = this.weekDays();
    return this.slots().flatMap(slot => {
      const start    = new Date(slot.startTime);
      const end      = new Date(slot.endTime);
      const dayIndex = days.findIndex(d => this.sameDay(d, start));
      if (dayIndex === -1) return [];
      const startRow = start.getHours() * 2 + (start.getMinutes() >= 30 ? 1 : 0);
      const endRow   = end.getHours()   * 2 + (end.getMinutes()   >  0  ? 1 : 0);
      return [{ slot, dayIndex, startRow, rowSpan: Math.max(1, endRow - startRow) }];
    });
  });

  flatIdeas = computed<{ id: number; label: string }[]>(() => {
    const flatten = (nodes: IdeaNode[], depth = 0): { id: number; label: string }[] =>
      nodes.flatMap(n => [
        { id: n.id, label: '  '.repeat(depth) + n.title },
        ...flatten(n.children, depth + 1)
      ]);
    return flatten(this.ideaNodes());
  });

  ngOnInit() {
    this.load();
    this.ideaSvc.getTree().subscribe(t => {
      this.ideaNodes.set(t);
      const ideaNodeId = this.route.snapshot.queryParamMap.get('ideaNodeId');
      if (ideaNodeId) this.openCreate(undefined, undefined, +ideaNodeId);
    });
  }

  load() {
    this.loading.set(true);
    const days  = this.weekDays();
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

  openCreate(dayIndex?: number, hour?: number, ideaNodeId?: number) {
    this.form = this.emptyForm();
    if (dayIndex !== undefined && hour !== undefined) {
      const day = this.weekDays()[dayIndex];
      this.form.date      = this.toDateInput(day);
      this.form.startHour = hour;
      this.form.endHour   = Math.min(hour + 1, 23);
    }
    if (ideaNodeId) this.form.ideaNodeId = ideaNodeId;
    this.editingId.set(null);
    this.showForm.set(true);
  }

  openEdit(slot: ScheduleSlot) {
    const start = new Date(slot.startTime);
    const end   = new Date(slot.endTime);
    this.form = {
      title:       slot.title,
      description: slot.description ?? '',
      date:        this.toDateInput(start),
      startHour:   start.getHours(),
      endHour:     end.getHours() || 23,
      recurrence:  slot.recurrence ?? '',
      ideaNodeId:  slot.ideaNodeId ?? null
    };
    this.editingId.set(slot.id);
    this.showForm.set(true);
  }

  save() {
    if (!this.form.title.trim() || !this.form.date) return;
    const req = this.buildRequest();
    const id  = this.editingId();
    const obs$ = id ? this.svc.update(id, req) : this.svc.create(req);
    (obs$ as any).subscribe(() => { this.showForm.set(false); this.load(); });
  }

  deleteSlot(id: number) { this.svc.delete(id).subscribe(() => this.load()); }
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
      title:       this.form.title.trim(),
      description: this.form.description || null,
      startTime:   start.toISOString(),
      endTime:     end.toISOString(),
      recurrence:  this.form.recurrence || null,
      ideaNodeId:  this.form.ideaNodeId || null
    };
  }

  private emptyForm(): SlotForm {
    return { title: '', description: '', date: this.toDateInput(new Date()), startHour: 9, endHour: 10, recurrence: '', ideaNodeId: null };
  }

  private getMonday(d: Date): Date {
    const date = new Date(d);
    const diff = (date.getDay() === 0 ? -6 : 1 - date.getDay());
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
