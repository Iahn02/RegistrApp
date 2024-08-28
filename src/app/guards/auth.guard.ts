import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class authGuard implements CanActivate {
  constructor(private router: Router, private toastController: ToastController) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const navigation = this.router.getCurrentNavigation();
    const email = navigation?.extras.state?.['email']; // Obtener el email del estado de la navegación
    const password = navigation?.extras.state?.['password']; // Obtener la contraseña del estado de la navegación
    const perfil = navigation?.extras.state?.['perfil'];
    console.log('guardia: ', email, password);
    if (email === 'bra.chacona@gmail.com' && password === '123456' && perfil === 'estudiante') {
      return true;
    } else if (email === 'iah.chacona@gmail.com' && password === '123457' && perfil === 'profesor') {
      return true;
    } else {
      this.router.navigate(['/home/login']);
      this.presentToast('No tienes acceso a esta vista');
      return false;
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: 'danger'
    });
    toast.present();
  }
}