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


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
  ],
  declarations: [HomePage, LoginComponent, StudentViewComponent, NavbarComponent, RestablecercontrasenaComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {}

