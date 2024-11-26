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
    const perfil = localStorage.getItem('perfil');
    const views = JSON.parse(localStorage.getItem('views') || '[]');
    const targetView = views.find((view: any) => state.url.includes(view.view));
    console.log('perfil:', perfil);
    console.log('views:', views);
    console.log('targetView:', targetView);

    if (targetView && targetView.letter === perfil) {
      return true;
    } else {
      const toast = await this.toastController.create({
        message: 'No tiene permiso para acceder a esta vista.',
        duration: 2000,
        position: 'top'
      });
      await toast.present();
      this.router.navigate(['/login']);
      return false;
    }
  }
}