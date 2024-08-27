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

  constructor(
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {}

  async onSubmit() {
    // Validar el email y la contraseña
    if (this.email === '' && this.password === '') {
      // Mostrar mensaje de éxito
      await this.presentToast('Inicio de sesión exitoso');
      
      // Redirigir al usuario a la página de inicio
      this.router.navigate(['/home']);
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
}