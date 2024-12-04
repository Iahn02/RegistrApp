import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service'; // Importar ApiService correctamente

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  user: string = '';
  password: string = '';
  newPassword: string = ''; // Nueva contraseña
  confirmPassword: string = ''; // Confirmar nueva contraseña
  showPassword: boolean = false;
  failedAttempts: number = 0; // Contador de intentos fallidos
  users: { user: string, password: string, perfil: string }[] = [];
  isDarkTheme: boolean = false;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private apiService: ApiService // Inyectar ApiService
  ) { }
   onSubmit() {
    this.apiService.loginAlumno({ user: this.user, password: this.password }).subscribe(
      response => {
        console.log('Respuesta del servidor:', response);
        if (response.success) {
          localStorage.setItem('alumno', JSON.stringify(response.alumno));
          console.log('Alumno guardado en el local storage:', response.alumno);
          this.presentToast('Inicio de sesión exitoso', 'success');
          this.router.navigate(['/home/student-view']);
        } else {
          this.presentToast('Error al iniciar sesión', 'danger');
          this.failedAttempts++;
        }
        this.limpiarInputs(); // Limpiar los inputs después de la respuesta
      },
      error => {
        console.log('Error del servidor:', error);
        this.presentToast('Error al iniciar sesión', 'danger');
        this.failedAttempts++;
        this.limpiarInputs(); // Limpiar los inputs después de la respuesta
      }
    );
  }

  onUpdatePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.presentToast('Las contraseñas no coinciden', 'danger');
      return;
    }

    this.presentToast('Contraseña restablecida con éxito', 'success');
    this.router.navigate(['/home/login'], { state: { user: this.user, password: this.newPassword } }).then(() => {
      
    });
  }

  presentToast(message: string, color: string = 'success') {
    this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color
    }).then(toast => toast.present());
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  navigateToRestablecerContrasena() {
    this.router.navigate(['home/restablecercontrasena']);
  }
  limpiarInputs() {
    this.user = '';
    this.password = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

}