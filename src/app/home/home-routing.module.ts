import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { LoginComponent } from '../login/login.component';
import { StudentViewComponent } from '../student-view/student-view.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,

  },
  {
    path: 'login',
    component: LoginComponent,

  },
  {
    path: 'student-view',
    component: StudentViewComponent,
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
