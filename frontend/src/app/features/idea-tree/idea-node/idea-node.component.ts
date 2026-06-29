import { Component, OnInit, inject, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IdeaNode, Task, TicketRef } from '../idea-node.model';
import { TaskService } from '../task.service';
import { ProjectService } from '../../projects/project.service';

@Component({
  selector: 'app-idea-node',
  standalone: true,
  imports: [CommonModule, FormsModule, IdeaNodeComponent],
  templateUrl: './idea-node.component.html',
  styleUrl: './idea-node.component.scss'
})
export class IdeaNodeComponent implements OnInit {
  node         = input.required<IdeaNode>();
  addChild     = output<{ parentId: number; title: string }>();
  editNode     = output<{ id: number; title: string; content: string | null }>();
  deleteNode   = output<number>();
  scheduleNode = output<number>();

  private taskSvc    = inject(TaskService);
  private projectSvc = inject(ProjectService);
  private router     = inject(Router);

  collapsed   = signal(false);
  editing     = signal(false);
  addingChild = signal(false);
  addingTask  = signal(false);

  editTitle     = signal('');
  editContent   = signal('');
  newChildTitle = signal('');
  newTaskTitle  = signal('');

  tasks        = signal<Task[]>([]);
  linkingTaskId = signal<number | null>(null);
  allTickets   = signal<(TicketRef & { projectName: string })[]>([]);

  hasChildren = computed(() => this.node().children.length > 0);

  ngOnInit() {
    this.tasks.set(this.node().tasks ?? []);
  }

  toggleCollapse() { this.collapsed.update(v => !v); }

  startEdit() {
    this.editTitle.set(this.node().title);
    this.editContent.set(this.node().content ?? '');
    this.editing.set(true);
  }

  confirmEdit() {
    if (!this.editTitle().trim()) return;
    this.editNode.emit({ id: this.node().id, title: this.editTitle().trim(), content: this.editContent().trim() || null });
    this.editing.set(false);
  }

  cancelEdit() { this.editing.set(false); }

  startAddChild() {
    this.newChildTitle.set('');
    this.addingChild.set(true);
    this.collapsed.set(false);
  }

  confirmAddChild() {
    if (!this.newChildTitle().trim()) return;
    this.addChild.emit({ parentId: this.node().id, title: this.newChildTitle().trim() });
    this.newChildTitle.set('');
    this.addingChild.set(false);
  }

  cancelAddChild() { this.addingChild.set(false); }

  startAddTask() {
    this.newTaskTitle.set('');
    this.addingTask.set(true);
    this.collapsed.set(false);
  }

  confirmAddTask() {
    const title = this.newTaskTitle().trim();
    if (!title) return;
    this.taskSvc.create(this.node().id, { title }).subscribe(t => {
      this.tasks.update(ts => [...ts, t]);
      this.newTaskTitle.set('');
      this.addingTask.set(false);
    });
  }

  cancelAddTask() { this.addingTask.set(false); }

  toggleTask(task: Task) {
    this.taskSvc.toggle(this.node().id, task.id).subscribe(updated => {
      this.tasks.update(ts => ts.map(t => t.id === updated.id ? updated : t));
    });
  }

  deleteTask(task: Task) {
    this.taskSvc.delete(this.node().id, task.id).subscribe(() => {
      this.tasks.update(ts => ts.filter(t => t.id !== task.id));
    });
  }

  openTicketPicker(task: Task) {
    if (this.linkingTaskId() === task.id) { this.linkingTaskId.set(null); return; }
    this.linkingTaskId.set(task.id);
    this.projectSvc.getAll().subscribe(projects => {
      const linked = task.tickets?.map(t => t.id) ?? [];
      this.allTickets.set(
        projects.flatMap(p => p.tickets
          .filter(t => !linked.includes(t.id))
          .map(t => ({ id: t.id, projectId: p.id, title: t.title, status: t.status, priority: t.priority, projectName: p.name }))
        )
      );
    });
  }

  linkTicket(task: Task, ticketId: number, projectId: number) {
    const found = this.allTickets().find(t => t.id === ticketId);
    if (!found) return;
    this.taskSvc.linkTicket(ticketId, task.id).subscribe(() => {
      this.tasks.update(ts => ts.map(t => t.id === task.id
        ? { ...t, tickets: [...(t.tickets ?? []), { id: found.id, projectId, title: found.title, status: found.status, priority: found.priority }] }
        : t
      ));
      this.linkingTaskId.set(null);
    });
  }

  unlinkTicket(task: Task, ticket: TicketRef) {
    this.taskSvc.unlinkTicket(ticket.id, task.id).subscribe(() => {
      this.tasks.update(ts => ts.map(t => t.id === task.id
        ? { ...t, tickets: t.tickets.filter(tr => tr.id !== ticket.id) }
        : t
      ));
    });
  }

  goToTicket(ticket: TicketRef) {
    this.router.navigate(['/projects'], { queryParams: { ticketId: ticket.id } });
  }

  onAddChild(event: { parentId: number; title: string })                   { this.addChild.emit(event); }
  onEditNode(event: { id: number; title: string; content: string | null }) { this.editNode.emit(event); }
  onDeleteNode(id: number)                                                  { this.deleteNode.emit(id); }
}
