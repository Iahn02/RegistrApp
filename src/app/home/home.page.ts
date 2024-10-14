  import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
  import { IonModal } from '@ionic/angular';
  import { Router } from '@angular/router';
  import { Platform } from '@ionic/angular';
  import { Subscription, interval } from 'rxjs'; // Asegúrate de importar 'interval'

  @Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
  })
  export class HomePage implements OnInit, OnDestroy {
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
    qrCodeUrl: string = ''; // URL inicial del QR

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

    qrSubscription!: Subscription; // Declarar la propiedad qrSubscription
    countdownSubscription!: Subscription; // Declarar la propiedad countdownSubscription

    abrirModal(seccion: string) {
      this.seccionSeleccionada = seccion;
      this.actualizarQRCode(); // Obtener el QR al abrir el modal
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

    actualizarQRCode() {
      const qrData = encodeURIComponent(this.seccionSeleccionada);
      const timestamp = new Date().getTime(); // Obtener un timestamp único
      this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${qrData}&size=200x200&timestamp=${timestamp}`;
      console.log(`QR actualizado: ${this.qrCodeUrl}`); // Agregar log para verificar la actualización
    }

    ngOnInit() {
      // Iniciar el temporizador para actualizar el QR cada 30 segundos
      this.qrSubscription = interval(30000).subscribe(() => {
        this.qrCodeUrl = ''; // Eliminar el QR actual
        this.actualizarQRCode(); // Generar un nuevo QR
      });

      // Iniciar el temporizador para mostrar en consola los segundos restantes
      this.countdownSubscription = interval(1000).subscribe((secondsElapsed) => {
        const secondsRemaining = 30 - (secondsElapsed % 30);
        console.log(`Segundos restantes para actualizar el QR: ${secondsRemaining}`);
      });
    }

    ngOnDestroy() {
      // Cancelar la suscripción cuando el componente se destruya
      if (this.qrSubscription) {
        this.qrSubscription.unsubscribe();
      }
      if (this.countdownSubscription) {
        this.countdownSubscription.unsubscribe();
      }
    }

    // Método para navegar a la ruta 'restablecer-contrasena'
    
  }