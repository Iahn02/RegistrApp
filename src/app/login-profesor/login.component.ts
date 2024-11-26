import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login-profesor',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginProfesorComponent {
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
     this.apiService.loginDocente({ user: this.user, password: this.password }).subscribe(
      response => {
        console.log('Respuesta del servidor:', response);
        if (response) {
          this.presentToast('Inicio de sesión exitoso', 'success');
          this.router.navigate(['/home/profesor-view']);
        } else {
          this.presentToast('Error al iniciar sesión', 'danger');
          this.failedAttempts++;
        }
      },
      error => {
        console.log('Error del servidor:', error);
        this.presentToast('Error al iniciar sesión', 'danger');
        this.failedAttempts++;
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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  limpiarInputs() {
    this.user = '';
    this.password = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

}