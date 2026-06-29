import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IdeaNode } from '../idea-node.model';

@Component({
  selector: 'app-idea-node',
  standalone: true,
  imports: [CommonModule, FormsModule, IdeaNodeComponent],
  templateUrl: './idea-node.component.html',
  styleUrl: './idea-node.component.scss'
})
export class IdeaNodeComponent {
  node = input.required<IdeaNode>();
  addChild   = output<{ parentId: number; title: string }>();
  editNode   = output<{ id: number; title: string; content: string | null }>();
  deleteNode = output<number>();

  collapsed  = signal(false);
  editing    = signal(false);
  addingChild = signal(false);

  editTitle   = signal('');
  editContent = signal('');
  newChildTitle = signal('');

  hasChildren = computed(() => this.node().children.length > 0);

  toggleCollapse() { this.collapsed.update(v => !v); }

  startEdit() {
    this.editTitle.set(this.node().title);
    this.editContent.set(this.node().content ?? '');
    this.editing.set(true);
  }

  confirmEdit() {
    if (!this.editTitle().trim()) return;
    this.editNode.emit({ id: this.node().id, title: this.editTitle().trim(), content: this.editContent() || null });
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
    this.addingChild.set(false);
  }

  cancelAddChild() { this.addingChild.set(false); }

  onAddChild(event: { parentId: number; title: string }) { this.addChild.emit(event); }
  onEditNode(event: { id: number; title: string; content: string | null }) { this.editNode.emit(event); }
  onDeleteNode(id: number) { this.deleteNode.emit(id); }
}
