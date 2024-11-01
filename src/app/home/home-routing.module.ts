import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { LoginComponent } from '../login/login.component';
import { StudentViewComponent } from '../student-view/student-view.component';
import { RestablecercontrasenaComponent } from '../restablecercontrasena/restablecercontrasena.component'; // Importa el componente Restablecercontrasena
import { authGuard } from '../guards/auth.guard'; // Importa el authGuard
import { studentGuard } from '../guards/student.guard'; // Importa el studentGuard

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    canActivate: [authGuard] // Añade el authGuard
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'student-view',
    component: StudentViewComponent,
    canActivate: [studentGuard]
  },
  {
    path: 'restablecercontrasena',
    component: RestablecercontrasenaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
