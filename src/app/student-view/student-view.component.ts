import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular'; // Importar ToastController aquí
import { IonModal } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service'; // Importar el servicio ApiService
import { ZXingScannerModule } from '@zxing/ngx-scanner'; // Asegúrate de que esta importación esté presente

@Component({
  selector: 'app-student-view',
  templateUrl: './student-view.component.html',
  styleUrls: ['./student-view.component.scss']
})
export class StudentViewComponent implements OnInit {
  usuario: any;
  storedAlumno: any;
  videoRef : any;

  @ViewChild('modal') modal!: IonModal;

  mostrarAlerta: boolean = false;
  alertButtons: any[];

  constructor(private router: Router, private apiService: ApiService, private toastController: ToastController) { // Inyectar ToastController
    
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
    this.videoRef = document.getElementById('videocamara');
    const storedAlumnoData = localStorage.getItem('alumno');
    if (storedAlumnoData) {
      this.usuario = JSON.parse(storedAlumnoData);
    } else {
      this.usuario = {
        "nombre": "Alumno Desconocido",
        "user": "Desconocido"
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
    localStorage.removeItem('perfil');
    localStorage.removeItem('Autenticacion');
    this.router.navigate(['/login']);
  }

  confirmarCerrarSesion() {
    this.mostrarAlerta = true;
  }

  // Método para manejar el resultado del escaneo
  onCodeResult(resultString: string) {
    console.log('Resultado del escaneo:', resultString);
    // Ejecutar el endpoint de registrar presencia directamente al escanear el código QR
    const alumnoId = this.usuario.id; // Obtener el id del alumno del local storage
    this.apiService.enviarPresencia(alumnoId, resultString).subscribe(
      response => {
        console.log('Asistencia registrada exitosamente :', response.encontrado);
        if (response.encontrado) {
          console.log('Alumno encontrado:', response.alumno.nombre);
          console.log(response.encontrado);
          this.usuario.status = true; // Actualizar el estado del alumno a true
          this.presentToast(`Asistencia registrada y estado de presencia actualizado para el alumno ${response.alumno.nombre}`, 'success'); // Mostrar mensaje de éxito
        } else {
          console.log('Error en el registro de presencia:', response.message);
          this.presentToast('Error en el registro de presencia', 'danger'); // Mostrar mensaje de error
        }
      },
      error => {
        console.error('Error al registrar presencia:', error);
        this.presentToast('Error al registrar presencia', 'danger'); // Mostrar mensaje de error
      }
    );
  }
  presentToast(message: string, color: string = 'success') {
    this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color
    }).then(toast => toast.present());
  }
}
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZXingScannerModule // Asegúrate de que esta importación esté presente en el módulo
  ],
  declarations: [StudentViewComponent]
  ,
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Agrega esta línea

})
export class StudentViewModule { }