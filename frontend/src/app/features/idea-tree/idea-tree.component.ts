import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IdeaNodeService } from './idea-node.service';
import { IdeaNodeComponent } from './idea-node/idea-node.component';
import { IdeaNode } from './idea-node.model';

@Component({
  selector: 'app-idea-tree',
  standalone: true,
  imports: [CommonModule, FormsModule, IdeaNodeComponent],
  templateUrl: './idea-tree.component.html',
  styleUrl: './idea-tree.component.scss'
})
export class IdeaTreeComponent implements OnInit {
  private svc = inject(IdeaNodeService);

  tree    = signal<IdeaNode[]>([]);
  loading = signal(false);
  newRootTitle = signal('');

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.svc.getTree().subscribe({ next: t => { this.tree.set(t); this.loading.set(false); }, error: () => this.loading.set(false) });
  }

  addRoot() {
    const title = this.newRootTitle().trim();
    if (!title) return;
    this.svc.create({ title }).subscribe(() => { this.newRootTitle.set(''); this.load(); });
  }

  onAddChild(event: { parentId: number; title: string }) {
    this.svc.create({ title: event.title, parentId: event.parentId }).subscribe(() => this.load());
  }

  onEditNode(event: { id: number; title: string; content: string | null }) {
    const node = this.findNode(this.tree(), event.id);
    if (!node) return;
    this.svc.update(event.id, { title: event.title, content: event.content, parentId: node.parentId }).subscribe(() => this.load());
  }

  onDeleteNode(id: number) {
    this.svc.delete(id).subscribe(() => this.load());
  }

  private findNode(nodes: IdeaNode[], id: number): IdeaNode | null {
    for (const n of nodes) {
      if (n.id === id) return n;
      const found = this.findNode(n.children, id);
      if (found) return found;
    }
    return null;
  }
}
