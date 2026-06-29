import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from './project.service';
import { Project, Ticket, STATUSES, STATUS_LABELS, PRIORITY_COLORS } from './project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  private svc    = inject(ProjectService);
  private route  = inject(ActivatedRoute);
  private router = inject(Router);

  readonly STATUSES      = STATUSES;
  readonly STATUS_LABELS = STATUS_LABELS;
  readonly PRIORITY_COLORS = PRIORITY_COLORS;

  projects      = signal<Project[]>([]);
  selectedId    = signal<number | null>(null);
  highlightedId = signal<number | null>(null);
  loading       = signal(false);

  newProjectName = signal('');
  addingProject  = signal(false);

  showTicketForm  = signal(false);
  ticketFormTitle = signal('');
  ticketFormDesc  = signal('');
  ticketFormPrio  = signal<'LOW'|'MEDIUM'|'HIGH'>('MEDIUM');
  ticketFormStatus = signal<'TODO'|'IN_PROGRESS'|'DONE'>('TODO');

  editingTicketId   = signal<number | null>(null);
  editTicketTitle   = signal('');
  editTicketDesc    = signal('');
  editTicketPrio    = signal<'LOW'|'MEDIUM'|'HIGH'>('MEDIUM');

  selected = computed(() => this.projects().find(p => p.id === this.selectedId()) ?? null);

  ticketsByStatus(status: string): Ticket[] {
    return (this.selected()?.tickets ?? []).filter(t => t.status === status);
  }

  ngOnInit() {
    this.load();
    const ticketId = this.route.snapshot.queryParamMap.get('ticketId');
    if (ticketId) this.highlightedId.set(+ticketId);
  }

  load() {
    this.loading.set(true);
    this.svc.getAll().subscribe({ next: ps => {
      this.projects.set(ps);
      this.loading.set(false);
      if (ps.length && !this.selectedId()) this.selectedId.set(ps[0].id);
      // auto-select project containing highlighted ticket
      const hId = this.highlightedId();
      if (hId) {
        const proj = ps.find(p => p.tickets.some(t => t.id === hId));
        if (proj) this.selectedId.set(proj.id);
      }
    }, error: () => this.loading.set(false) });
  }

  selectProject(id: number) { this.selectedId.set(id); }

  addProject() {
    const name = this.newProjectName().trim();
    if (!name) return;
    this.svc.create({ name }).subscribe(() => { this.newProjectName.set(''); this.addingProject.set(false); this.load(); });
  }

  deleteProject(id: number) {
    if (!confirm('Delete this project and all its tickets?')) return;
    this.svc.delete(id).subscribe(() => {
      if (this.selectedId() === id) this.selectedId.set(null);
      this.load();
    });
  }

  addTicket() {
    const proj = this.selected();
    if (!proj || !this.ticketFormTitle().trim()) return;
    this.svc.createTicket(proj.id, {
      title: this.ticketFormTitle().trim(),
      description: this.ticketFormDesc().trim() || null,
      priority: this.ticketFormPrio(),
      status: this.ticketFormStatus()
    }).subscribe(() => { this.resetTicketForm(); this.load(); });
  }

  startEditTicket(ticket: Ticket) {
    this.editingTicketId.set(ticket.id);
    this.editTicketTitle.set(ticket.title);
    this.editTicketDesc.set(ticket.description ?? '');
    this.editTicketPrio.set(ticket.priority as 'LOW'|'MEDIUM'|'HIGH');
  }

  cancelEditTicket() { this.editingTicketId.set(null); }

  saveEditTicket(ticket: Ticket) {
    const title = this.editTicketTitle().trim();
    if (!title) return;
    this.svc.updateTicket(ticket.id, {
      title,
      description: this.editTicketDesc().trim() || null,
      priority: this.editTicketPrio(),
      status: ticket.status
    }).subscribe(() => { this.editingTicketId.set(null); this.load(); });
  }

  moveTicket(ticket: Ticket, status: 'TODO'|'IN_PROGRESS'|'DONE') {
    if (ticket.status === status) return;
    this.svc.updateTicket(ticket.id, { title: ticket.title, status }).subscribe(() => this.load());
  }

  deleteTicket(id: number) {
    this.svc.deleteTicket(id).subscribe(() => this.load());
  }

  isHighlighted(id: number) { return this.highlightedId() === id; }

  resetTicketForm() {
    this.ticketFormTitle.set('');
    this.ticketFormDesc.set('');
    this.ticketFormPrio.set('MEDIUM');
    this.ticketFormStatus.set('TODO');
    this.showTicketForm.set(false);
  }
}
