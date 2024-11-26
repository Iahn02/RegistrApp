import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NotFoundPage } from './not-found/not-found.page'; // Importa el componente NotFoundPage
import { LoginComponent } from './login/login.component';
import { LoginProfesorComponent } from './login-profesor/login.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'login-profesor',
    component: LoginProfesorComponent,
  },
  {
    path: '**',
    component: NotFoundPage, // Enruta al componente NotFoundPage
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
