  import { Component, ViewChild } from '@angular/core';
  import { IonModal } from '@ionic/angular';

  @Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
  })
  export class HomePage {
    @ViewChild('modal') modal!: IonModal;
    fechaHora: Date = new Date();
    nombreUsuario: string = 'Usuario';
    seccionSeleccionada: string = '';
    estudiantes: { nombre: string }[] = [
      { nombre: 'Diegue Chacon' },
      { nombre: 'Brando Vera' },
      { nombre: 'Iahn Salazar' },
      { nombre: 'Angel Diaz' },
      // ... otros estudiantes
    ];

    constructor() {}

    abrirModal(seccion: string) {
      this.seccionSeleccionada = seccion;
      this.modal.present();
    }

    cerrarModal() {
      this.modal.dismiss();
    }
  }