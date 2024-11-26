import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  views = [
    { view: 'profesor-view', letter: 'P' },
    { view: 'student-view', letter: 'A' }
  ];

  constructor() {
    localStorage.setItem('views', JSON.stringify(this.views));
  }
}
