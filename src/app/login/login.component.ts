import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  newPassword: string = ''; // Nueva contraseña
  confirmPassword: string = ''; // Confirmar nueva contraseña
  showPassword: boolean = false;
  failedAttempts: number = 0; // Contador de intentos fallidos
  users: { email: string, password: string, perfil: string }[] = [];

  constructor(
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    // Obtener los usuarios del local storage
    
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    } else {
      // Si no hay usuarios en el local storage, inicializar con algunos valores por defecto
      this.users = [
        { email: 'bra.chacona@gmail.com', password: '123456', perfil: 'estudiante' },
        { email: 'iah.chacona@gmail.com', password: '123457', perfil: 'profesor' }
      ];
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }

  onSubmit() {
    // Obtener los usuarios del local storage y mostrar en consola
    
    const storedUsers = localStorage.getItem('users');
    // Validar el email y la contraseña
    const user = this.users.find(user => user.email === this.email && user.password === this.password);
    if (user) {
      // Mostrar mensaje de éxito
      this.presentToast('Inicio de sesión exitoso');
      // Redirigir al usuario a la página de inicio sin parámetros en la URL
      const route = user.perfil === 'estudiante' ? '/home/student-view' : '/home';
      this.router.navigate([route], { state: { email: this.email, password: this.password, perfil: user.perfil } }).then(() => {
        this.limpiarInputs();
      });
    } else {
      // Incrementar el contador de intentos fallidos
      this.failedAttempts++;
      // Mostrar mensaje de error
      this.presentToast(`Email o contraseña incorrectos. Intentos fallidos: ${this.failedAttempts}`, 'danger');
    }
  }

  onUpdatePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.presentToast('Las contraseñas no coinciden', 'danger');
      return;
    }

    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const userIndex = users.findIndex((user: { email: string; }) => user.email === this.email);
      if (userIndex !== -1) {
        users[userIndex].password = this.newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        this.presentToast('Contraseña restablecida con éxito', 'success');
        this.router.navigate(['/home/login'], { state: { email: this.email, password: this.newPassword } }).then(() => {
          
        });
      } else {
        this.presentToast('Correo electrónico no encontrado', 'danger');
      }
    } else {
      this.presentToast('No hay usuarios registrados', 'danger');
    }
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
    this.email = '';
    this.password = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }
}

