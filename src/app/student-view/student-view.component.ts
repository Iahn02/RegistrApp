import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-student-view',
  templateUrl: './student-view.component.html',
  styleUrls: ['./student-view.component.scss']
})
export class StudentViewComponent {
  @Input() nombreUsuario: string = '';
  @Input() fechaHora: Date = new Date();
}
