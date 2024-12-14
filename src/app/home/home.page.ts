import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Subscription, interval } from 'rxjs'; // Asegúrate de importar 'interval'
import * as QRCode from 'qrcode';
import axios from 'axios'; // Importar axios para consumir la API
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  @ViewChild('modalQR') modalQR!: IonModal;
  @ViewChild('modalConfirmar') modalConfirmar!: IonModal;
  fechaHora: Date = new Date();
  nombreUsuario: string = '';
  seccionSeleccionada: any = {}; // Cambiar a objeto para almacenar más información
  estudiantes: any[] = [];
  mostrarAlerta: boolean = false;
  alertButtons: any[];
  isNightMode: boolean = false;
  qrCodeUrl: string = ''; // URL inicial del QR
  user: any = {}; // Crear un objeto any vacío para recibir al profesor
  userDocente: any = {}; // Crear un objeto any vacío para recibir al profesor
  cursos: any[] = []; // Array para almacenar los cursos del profesor
  iconColor: string = 'danger'; // Color inicial del icono

  constructor(private router: Router, private platform: Platform, private apiService: ApiService) {
    const navigation = this.router.getCurrentNavigation();
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

  abrirModal() {
    this.modalQR.present();
  }

  cerrarModal() {
    this.modalQR.dismiss();
  }

  // Método para cerrar sesión
  cerrarSesion() {
    // Lógica para cerrar sesión
    localStorage.removeItem('user'); // Eliminar el usuario del almacenamiento local
    localStorage.removeItem('perfil');
    localStorage.removeItem('Autenticacion');
    this.router.navigate(['/login']);
  }

  confirmarCerrarSesion() {
    this.mostrarAlerta = true;
  }

  toggleNightMode() {
    this.isNightMode = !this.isNightMode;
    if (this.isNightMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('day-mode');
    } else {
      document.body.classList.add('day-mode');
      document.body.classList.remove('dark-mode');
    }
  }

  ngOnInit() {
    const storedDocente = localStorage.getItem('docente');
    if (storedDocente) {
      const docente = JSON.parse(storedDocente);
      console.log('Docente en el home:', docente);
      this.userDocente = docente;
    }
    // Recargar la página al entrar al home
    if (this.userDocente && this.userDocente.cursos) {
      this.cursos = this.userDocente.cursos; // Almacenar los cursos del docente
      this.seccionSeleccionada = this.cursos[0]; // Seleccionar la primera sección del docente

      // Consumir el método para obtener los estudiantes del profesor
      this.apiService.obtenerEstudiantes(this.userDocente.id, this.seccionSeleccionada.codigo).subscribe(estudiantes => {
        this.estudiantes = estudiantes; // Asignar los estudiantes obtenidos
        console.log('Estudiantes obtenidos:', this.estudiantes);

        // Adaptar lo del socket para que cada vez que emita un mensaje se dispare de nuevo el método obtenerEstudiantes
        const socket = (window as any).io(this.apiService['apiUrl']);
        socket.on('nuevaAsistencia', () => {
          this.apiService.obtenerEstudiantes(this.userDocente.id, this.seccionSeleccionada.codigo).subscribe(nuevosEstudiantes => {
            this.estudiantes = nuevosEstudiantes; // Actualizar los estudiantes obtenidos
            console.log('Estudiantes actualizados:', this.estudiantes);
          });
        });
      });

    }
  }
  generarQRCode() {
    this.apiService.generarQR().subscribe(
      (response: any) => {
        this.qrCodeUrl = response.url;
        console.log('Código QR generado:', this.qrCodeUrl);
      },
      (error) => {
        console.error('Error al generar el código QR:', error);
      }
    );
  }

  abrirModalCurso(curso: any) {

    this.seccionSeleccionada = curso; // Asigna el curso seleccionado
    this.generarQRCode();
    this.apiService.obtenerEstudiantes(this.userDocente.id, curso.codigo).subscribe(estudiantes => {
      this.estudiantes = estudiantes; // Asignar los estudiantes obtenidos
      console.log('Curso seleccionado:', curso);
      console.log('Estudiantes obtenidos:', this.estudiantes); // Mostrar los estudiantes obtenidos
      this.modalQR.present();
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
}
