  import { Component, ViewChild } from '@angular/core';
  import { IonModal } from '@ionic/angular';
  import { Router } from '@angular/router';

  @Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
  })
  export class HomePage {
    @ViewChild('modalQR') modalQR!: IonModal;
    @ViewChild('modalConfirmar') modalConfirmar!: IonModal;
    fechaHora: Date = new Date();
    nombreUsuario: string = 'Profesor';
    seccionSeleccionada: string = '';
    estudiantes: { nombre: string }[] = [
      { nombre: 'Diegue Chacon' },
      { nombre: 'Brando Vera' },
      { nombre: 'Iahn Salazar' },
      { nombre: 'Angel Diaz' },
      // ... otros estudiantes
    ];
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

    abrirModal(seccion: string) {
      this.seccionSeleccionada = seccion;
      this.modalQR.present();
    }

    cerrarModal() {
      this.modalQR.dismiss();
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