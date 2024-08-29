  import { Component, ViewChild } from '@angular/core';
  import { IonModal } from '@ionic/angular';
  import { Router } from '@angular/router';
  import { Platform } from '@ionic/angular';

  @Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
  })
  export class HomePage {
    @ViewChild('modalQR') modalQR!: IonModal;
    @ViewChild('modalConfirmar') modalConfirmar!: IonModal;
    fechaHora: Date = new Date();
    nombreUsuario: string = 'Profesor Iahn';
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
    isNightMode: boolean = false;

    constructor(private router: Router, private platform: Platform) {
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

  toggleNightMode() {
    this.isNightMode = !this.isNightMode;
    if (this.isNightMode) {
      document.body.classList.add('night-mode');
      document.body.classList.remove('day-mode');
    } else {
      document.body.classList.add('day-mode');
      document.body.classList.remove('night-mode');
    }
  }
}