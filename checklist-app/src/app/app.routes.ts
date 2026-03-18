import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListComponent } from './components/list/list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'list/:id', component: ListComponent },
  { path: '**', redirectTo: '' }
];
