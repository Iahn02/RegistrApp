import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { LoginComponent } from '../login/login.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { StudentViewComponent } from '../student-view/student-view.component';
import { RestablecercontrasenaComponent } from '../restablecercontrasena/restablecercontrasena.component';
import { NotFoundPage } from '../not-found/not-found.page'; // Importa el componente NotFoundPage
import { LoginProfesorComponent } from '../login-profesor/login.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ZXingScannerModule,
  ],
  declarations: [HomePage, LoginComponent, NavbarComponent, RestablecercontrasenaComponent, NotFoundPage, LoginProfesorComponent], // Agrega NotFoundPage a las declaraciones
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {}

