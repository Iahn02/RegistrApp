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
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {}

  async onSubmit() {
    // Validar el email y la contraseña
    if (this.email === 'bra.chacona@gmail.com' && this.password === '123456') {
      // Mostrar mensaje de éxito
      await this.presentToast('Inicio de sesión exitoso');
      console.log('login email: ', this.email);
      console.log('login password: ', this.password);
      // Redirigir al usuario a la página de inicio sin parámetros en la URL
      this.router.navigate(['/home/student-view'], { state: { email: this.email, password: this.password, perfil: 'estudiante' } });
    
    } else if (this.email === 'iah.chacona@gmail.com' && this.password === '123457') {
      // Mostrar mensaje de éxito
      await this.presentToast('Inicio de sesión exitoso');
      
      // Redirigir al usuario a la vista de estudiante sin parámetros en la URL
      this.router.navigate(['/home'], { state: { email: this.email, password: this.password, perfil: 'profesor' } });
    } else {
      // Mostrar mensaje de error
      await this.presentToast('Email o contraseña incorrectos', 'danger');
    }
  }

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color
    });
    toast.present();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}