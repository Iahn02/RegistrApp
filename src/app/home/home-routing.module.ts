import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { LoginComponent } from '../login/login.component';
import { StudentViewComponent } from '../student-view/student-view.component';
import { RestablecercontrasenaComponent } from '../restablecercontrasena/restablecercontrasena.component'; 
import { authGuard } from '../guards/auth.guard'; 
import { NotFoundPage } from '../not-found/not-found.page'; 


const routes: Routes = [
  {
    path: 'profesor-view',
    component: HomePage,
    canActivate: [authGuard]
  },
  {
    path: 'student-view',
    component: StudentViewComponent,
    canActivate: [authGuard]
  },
  {
    path: 'restablecercontrasena',
    component: RestablecercontrasenaComponent,
  },
  {
    path: '**',
    component: NotFoundPage, 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
