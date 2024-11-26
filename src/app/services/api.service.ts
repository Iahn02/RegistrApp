import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) {}

  // Métodos para autenticación
  registerDocente(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/docente/register`, data);
  }

  loginDocente(data: any): Observable<boolean> {
    console.log('Solicitud de inicio de sesión para docente:', data);
    return this.http.post(`${this.apiUrl}/auth/docente/login`, data).pipe(
      map((response: any) => {
        console.log('Respuesta del servidor:', response);
        if (response.message === 'Docente autenticado') {
          localStorage.setItem('perfil', 'P');
          localStorage.setItem('Autenticacion', 'true');
          return true;
        }
        return false;
      }),
      catchError((error) => {
        console.log('Error del servidor:', error);
        return of(false);
      })
    );
  }

  registerAlumno(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/alumno/register`, data);
  }
  loginAlumno(data: any): Observable<boolean> {
    console.log('Solicitud de inicio de sesión para alumno:', data);
    return this.http.post(`${this.apiUrl}/auth/alumno/login`, data).pipe(
      map((response: any) => {
        console.log('Respuesta del servidor:', response);
        if (response.message === 'Alumno autenticado') {
          localStorage.setItem('perfil', 'A');
          localStorage.setItem('Autenticacion', 'true');
          return true;
        }
        return false;
      }),
      catchError((error) => {
        console.log('Error del servidor:', error);
        return of(false);
      })
    );
  }

  // Métodos para asistencia
  generarQR(): Observable<any> {
    return this.http.get(`${this.apiUrl}/asistencia/generar-qr`);
  }

  registrarAsistencia(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/asistencia/registrar`, data);
  }
}
