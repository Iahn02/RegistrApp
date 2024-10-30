  import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
  import { IonModal } from '@ionic/angular';
  import { Router } from '@angular/router';
  import { Platform } from '@ionic/angular';
  import { Subscription, interval } from 'rxjs'; // Asegúrate de importar 'interval'
  import axios from 'axios'; // Importar axios para consumir la API

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
      }

      // Iniciar el temporizador para actualizar el QR cada 30 segundos
      this.qrSubscription = interval(30000).subscribe(() => {
        this.qrCodeUrl = ''; // Eliminar el QR actual
        this.actualizarQRCode(); // Generar un nuevo QR
      });

      // Iniciar el temporizador para mostrar en consola los segundos restantes
      this.countdownSubscription = interval(1000).subscribe((secondsElapsed) => {
        const secondsRemaining = 30 - (secondsElapsed % 30);
      });
    }

    actualizarQRCode() {
      const qrData = encodeURIComponent(this.seccionSeleccionada.nombre); // Usar nombre de la sección
      const timestamp = new Date().getTime(); // Obtener un timestamp único
      this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${qrData}&size=200x200&timestamp=${timestamp}`;
      console.log(`QR actualizado: ${this.qrCodeUrl}`); // Agregar log para verificar la actualización
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
      estudiante.asistenciaMarcada = true;
      this.iconColor = 'success'; // Cambiar el color del icono a success
      this.registrarAsistencia(estudiante.id, this.seccionSeleccionada.codigo, this.seccionSeleccionada.seccion, this.fechaHora.toISOString());
    }

    marcarAsistenteAusente(estudiante: any) {
      // Cambiar el color del icono a rojo para indicar que el estudiante ha sido marcado como ausente
      estudiante.asistenciaMarcada = false;
      this.iconColor = 'danger'; // Cambiar el color del icono a danger
      this.registrarAsistencia(estudiante.id, this.seccionSeleccionada.codigo, this.seccionSeleccionada.seccion, this.fechaHora.toISOString());
    }

    async registrarAsistencia(alumnoId: number, codigo: string, seccion: string, fecha: string) {
      try {
        const response = await axios.post('http://127.0.0.1:5000/registrar_asistencia', {
          alumno_id: alumnoId,
          codigo: codigo,
          seccion: seccion,
          fecha: fecha
        });

        if (response.status === 200) {
          console.log('Asistencia registrada:', response.data.message);
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