import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent  implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() { console.log('navbar');}

  cerrarSesion() {
    // Lógica para cerrar sesión
    this.router.navigate(['/home/login']).then(() => {
      window.location.reload();
    });
  }
  }

