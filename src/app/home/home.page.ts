import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Subscription, interval } from 'rxjs'; // Asegúrate de importar 'interval'
import axios from 'axios'; // Importar axios para consumir la API
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss', ],
})
export class HomePage implements OnInit, OnDestroy {
  @ViewChild('modalQR') modalQR!: IonModal;
  @ViewChild('modalConfirmar') modalConfirmar!: IonModal;
  fechaHora: Date = new Date();
  nombreUsuario: string = 'Profesor Iahn';
  seccionSeleccionada: any = {}; // Cambiar a objeto para almacenar más información
  estudiantes: any[] = [];
  mostrarAlerta: boolean = false;
  alertButtons: any[];
  isNightMode: boolean = false;
  qrCodeUrl: string = ''; // URL inicial del QR
  user: any;
  cursos: any[] = []; // Array para almacenar los cursos del profesor
  iconColor: string = 'danger'; // Color inicial del icono

  constructor(private router: Router, private platform: Platform) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.user = navigation.extras.state['user'];
    } else {
      // Alternativamente, puedes recuperar los datos del almacenamiento local
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }
    }

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

  abrirModal(seccion: any) {
    this.seccionSeleccionada = seccion;
    this.generarQRCode(); // Obtener el QR al abrir el modal
    this.modalQR.present();
  }

  cerrarModal() {
    this.modalQR.dismiss();
  }

  // Método para cerrar sesión
  cerrarSesion() {
    // Lógica para cerrar sesión
    localStorage.removeItem('user'); // Eliminar el usuario del almacenamiento local
    this.router.navigate(['/home/login']);
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
    // Recargar la página al entrar al home
    

    if (this.user) {
      console.log('Datos del usuario:', {
        id: this.user.id,
        nombre: this.user.nombre,
        user: this.user.user,
        correo: this.user.correo,
        tipoPerfil: this.user.tipoPerfil
      });
      // Aquí puedes usar los datos del usuario como desees
      this.obtenerCursosProfesor(this.user.id); // Obtener los cursos del profesor
      this.generarQRCode(); // Generar el QR para la sección seleccionada
    }
  }
  async generarQRCode() {
    try {
      const datosQR = {
        seccion: {
          codigo: this.seccionSeleccionada.codigo,
          nombre: this.seccionSeleccionada.nombre,
          alumnos: this.seccionSeleccionada.alumnos
        }
      };

      // Convertir los datos a un string JSON
      const datosQRString = JSON.stringify(datosQR);

      // Generar el código QR
      this.qrCodeUrl = await QRCode.toDataURL(datosQRString);
      console.log('Código QR generado:', this.qrCodeUrl);
      console.log('Datos QR:', datosQRString);
      console.log(datosQRString)
    } catch (error) {
      console.error('Error al generar el código QR:', error);
    }
  }


  async obtenerCursosProfesor(profesorId: number) {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/profesores/${profesorId}/cursos`);
      this.cursos = response.data;
      console.log('Cursos del profesor:', this.cursos);

      // Llenar el array de estudiantes para cada curso
      for (let curso of this.cursos) {
        const estudiantesResponse = await axios.get(`http://127.0.0.1:5000/profesores/${profesorId}/cursos/${curso.id}/alumnos`);
        curso.alumnos = estudiantesResponse.data;
        console.log(`Estudiantes del curso ${curso.nombre}:`, curso.alumnos);
      }
    } catch (error) {
      console.error('Error al obtener los cursos o estudiantes del profesor:', error);
    }
  }
  marcarAsistentePresente(estudiante: any) {
    // Cambiar el color del icono a verde para indicar que el estudiante ha sido marcado como asistente
    
    estudiante.status = 1; // 1 es para presente
    this.iconColor = 'success'; // Cambiar el color del icono a success
    this.registrarAsistencia(estudiante.id, this.seccionSeleccionada.codigo, this.seccionSeleccionada.seccion, this.fechaHora.toISOString(), estudiante.status);
  }

  marcarAsistenteAusente(estudiante: any) {
    // Cambiar el color del icono a rojo para indicar que el estudiante ha sido marcado como ausente
    estudiante.status = 0; // 0 es para ausente
    this.iconColor = 'danger'; // Cambiar el color del icono a danger
    this.registrarAsistencia(estudiante.id, this.seccionSeleccionada.codigo, this.seccionSeleccionada.seccion, this.fechaHora.toISOString(), estudiante.status);
  }

  async registrarAsistencia(alumnoId: number, codigo: string, seccion: string, fecha: string, status: number) {
    try {
      const response = await axios.post('http://127.0.0.1:5000/registrar_asistencia', {
        alumno_id: alumnoId,
        codigo: codigo,
        seccion: seccion,
        fecha: fecha,
        status: status
      });

      if (response.status === 200) {
        const estadoAsistencia = status === 1 ? 'presente' : 'ausente';
        console.log(`Asistencia registrada (${estadoAsistencia}):`, response.data.message);
      } else {
        console.error('Error al registrar la asistencia:', response.data.message);
      }
    } catch (error) {
      console.error('Error al registrar la asistencia:', error);
    }
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