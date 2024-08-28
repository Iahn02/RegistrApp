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
  usuario = {
    nombre: 'Brando',
    apellido: 'Chacona',
    email: 'bra.chacona@gmail.com'
  };

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

  ngOnInit() {}

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
    // Lógica para cerrar sesión
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