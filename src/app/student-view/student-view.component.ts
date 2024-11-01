import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-view',
  templateUrl: './student-view.component.html',
  styleUrls: ['./student-view.component.scss']
})
export class StudentViewComponent implements OnInit {
  usuario: any;

  @ViewChild('modal') modal!: IonModal;

  mostrarAlerta: boolean = false;
  alertButtons: any[];

  constructor(private router: Router) {
    this.alertButtons = [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => { this.mostrarAlerta = false; }
      },
      {
        text: 'Sí',
        handler: () => { this.cerrarSesion(); }
      }
    ];
  }

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.usuario = JSON.parse(storedUser);
    } else {
      this.usuario = {
        "id": 0,
        "user": "desconocido",
        "password": "",
        "nombre": "",
        "perfil":  1,
        "correo": ""
      };
    }
  }

  // Método para abrir el modal
  abrirModal() {
    this.modal.present();
  }

  // Método para cerrar el modal
  cerrarModal() {
    this.modal.dismiss();
  }

  // Método para cerrar sesión
  cerrarSesion() {
    localStorage.removeItem('user');
    this.router.navigate(['/home/login']);
  }

  confirmarCerrarSesion() {
    this.mostrarAlerta = true;
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