import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Curso de Udemy';
  curso: string = 'Curso de angular y Spring Boot';
  estudiante: string = 'Carlos Arturo Minota';
}
