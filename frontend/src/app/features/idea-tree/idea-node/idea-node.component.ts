import { Component, OnInit, inject, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IdeaNode, Task } from '../idea-node.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-idea-node',
  standalone: true,
  imports: [CommonModule, FormsModule, IdeaNodeComponent],
  templateUrl: './idea-node.component.html',
  styleUrl: './idea-node.component.scss'
})
export class IdeaNodeComponent implements OnInit {
  node = input.required<IdeaNode>();
  addChild   = output<{ parentId: number; title: string }>();
  editNode   = output<{ id: number; title: string; content: string | null }>();
  deleteNode = output<number>();

  private taskSvc = inject(TaskService);

  collapsed     = signal(false);
  editing       = signal(false);
  addingChild   = signal(false);
  addingTask    = signal(false);

  editTitle     = signal('');
  editContent   = signal('');
  newChildTitle = signal('');
  newTaskTitle  = signal('');

  tasks = signal<Task[]>([]);

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

  onAddChild(event: { parentId: number; title: string }) { this.addChild.emit(event); }
  onEditNode(event: { id: number; title: string; content: string | null }) { this.editNode.emit(event); }
  onDeleteNode(id: number) { this.deleteNode.emit(id); }
}
