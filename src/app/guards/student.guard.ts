import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class studentGuard implements CanActivate {
  constructor(private router: Router, private toastController: ToastController) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const navigation = this.router.getCurrentNavigation();

    // Obtener los usuarios del local storage
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.tipoPerfil === 2) {
        return true;
      } else {
        this.router.navigate(['/home/login']);
        this.presentToast('No tienes acceso a esta vista', 'danger');
        return false;
      }
    } else {
      this.router.navigate(['/home/login']);
      this.presentToast('No tienes acceso a esta vista', 'danger');
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
