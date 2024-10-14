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


    // Obtener los usuarios del local storage
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const user = users.find((user: { email: string, password: string, perfil: string }) => user.email === email && user.password === password && user.perfil === perfil);
      if (user) {
        return true;
      } else {
        this.router.navigate(['/home/login']);
        this.presentToast('No tienes acceso a esta vista', 'danger');
        return false;
      }
    } else {
      this.router.navigate(['/home/login']);
      this.presentToast('No hay usuarios registrados', 'danger');
      return false;
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