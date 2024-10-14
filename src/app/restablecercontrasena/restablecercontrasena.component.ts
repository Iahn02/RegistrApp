import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-restablecercontrasena',
  templateUrl: './restablecercontrasena.component.html',
  styleUrls: ['./restablecercontrasena.component.scss'],
})
export class RestablecercontrasenaComponent implements OnInit {

  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private toastController: ToastController, private router: Router, private alertController: AlertController) { }

  ngOnInit() {
    console.log('RestablecercontrasenaComponent');
  }

  async onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.presentToast('Las contraseñas no coinciden', 'danger');
      return;
    }

    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const userIndex = users.findIndex((user: { email: string; }) => user.email === this.email);
      if (userIndex !== -1) {
        const alert = await this.alertController.create({
          header: 'Código de verificación',
          message: `Se ha enviado un código a su correo electrónico (${this.email}). Por favor, introdúzcalo:`,
          inputs: [
            {
              name: 'codigo',
              type: 'text',
              placeholder: 'Código de verificación',
              attributes: {
                maxlength: 4
              }
            }
          ],
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                this.presentToast('Verificación cancelada', 'danger');
              }
            },
            {
              text: 'Verificar',
              handler: (data) => {
                if (data.codigo !== '1234') {
                  this.presentToast('Código de verificación incorrecto', 'danger');
                  return false;
                }
                this.presentToast('Contraseña restablecida con éxito', 'success');
                setTimeout(() => {
                  users[userIndex].password = this.newPassword;
                  localStorage.setItem('users', JSON.stringify(users));
                  
                  this.router.navigate(['/home/login']).then(() => {
                    window.location.reload();
                  });
                }, 1000);
                return true;
              }
            }
          ]
        });
        await alert.present();
      } else {
        this.presentToast('Correo electrónico no encontrado', 'danger');
      }
    } else {
      this.presentToast('No hay usuarios registrados', 'danger');
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color
    });
    toast.present();
  }
}
