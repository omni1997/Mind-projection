import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'idea-tree', pathMatch: 'full' },
  {
    path: 'idea-tree',
    loadComponent: () => import('./features/idea-tree/idea-tree.component').then(m => m.IdeaTreeComponent)
  },
  {
    path: 'scheduler',
    loadComponent: () => import('./features/scheduler/scheduler.component').then(m => m.SchedulerComponent)
  },
  {
    path: 'projects',
    loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent)
  }
];
