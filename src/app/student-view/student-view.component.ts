import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-view',
  templateUrl: './student-view.component.html',
  styleUrls: ['./student-view.component.scss']
})
export class StudentViewComponent implements OnInit {
  usuario = {
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@example.com'
  };

  constructor(private router: Router) {}

  ngOnInit() {}

  cerrarSesion() {
    // Lógica para cerrar sesión
    this.router.navigate(['/home/login']);
  }
}


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [StudentViewComponent]
})
export class StudentViewModule { }