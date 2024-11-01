import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import axios from 'axios'; // Importar axios correctamente

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
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
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.applyTheme();
  }

  async onSubmit() {
    console.log('Usuario:', this.user, 'Password:', this.password, );
    try {
      const body = {
        user: this.user,
        password: this.password
      };
      const response = await axios.post('http://127.0.0.1:5000/login', body);
      console.log('Comunicación con la PI:', response); // Agregar console log de la comunicación con la PI
      if (response.status === 200) {
        const user = response.data;
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Usuario almacenado en localStorage:', user);
        this.presentToast('Inicio de sesión exitoso');
        // Validar el perfil del usuario y redirigir según corresponda
        let route = '/home';
        if (user.tipoPerfil === 1) {
          route = '/home';
        } else if (user.tipoPerfil === 2) {
          route = '/home/student-view';
        }
        this.router.navigate([route], { state: { user: user, perfil: user.tipoPerfil } }).then(() => {
          window.location.reload();
          this.limpiarInputs();
        });
      }
    } catch (error: any) {
      console.error('Error en la solicitud:', error);
      if (error.response && error.response.status === 401) {
        this.presentToast('No autorizado. Por favor, verifique sus credenciales.', 'danger');
      } else {
        this.failedAttempts++;
        this.presentToast(`Usuario o contraseña incorrectos. Intentos fallidos: ${this.failedAttempts}`, 'danger');
      }
    }
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

  toggleTheme(event: any) {
    this.applyTheme();
  }

  applyTheme() {
    this.isDarkTheme = true;
    document.body.classList.remove('light-theme');
    document.body.style.backgroundColor = '#121212';
    document.body.style.color = '#ffffff';
    document.querySelectorAll('.card').forEach((element) => {
      element.classList.add('bg-dark', 'text-light');
      element.classList.remove('bg-light', 'text-dark');
    });
    document.querySelectorAll('.btn').forEach((element) => {
      element.classList.add('btn-dark');
      element.classList.remove('btn-light');
    });
    document.querySelectorAll('ion-content').forEach((element) => {
      element.style.backgroundColor = '#121212';
      element.style.color = '#ffffff';
    });
    console.log('El color aún no ha cambiado');
  }
}