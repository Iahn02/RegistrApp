import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';
  private socketUrl = 'http://localhost:3000/api/asistencia'; // URL base para Socket.IO

  constructor(private http: HttpClient) {}

  // Métodos para autenticación
  registerDocente(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/docente/register`, data);
  }
  loginDocente(data: any): Observable<{ success: boolean, docente?: any }> {
    console.log('Solicitud de inicio de sesión para docente:', data);
    return this.http.post(`${this.apiUrl}/auth/docente/login`, data).pipe(
      map((response: any) => {
        console.log('Respuesta del servidor:', response);
        if (response.message === 'Docente autenticado') {
          localStorage.setItem('perfil', 'P');
          localStorage.setItem('Autenticacion', 'true');
          localStorage.setItem('docente', JSON.stringify(response.docente));
          console.log(localStorage.getItem('docente'));
          console.log('Docente autenticado');
          return { success: true, docente: response.docente };
        }
        return { success: false };
      }),
      catchError((error) => {
        console.log('Error del servidor:', error);
        return of({ success: false });
      })
    );
  }
  enviarPresencia(alumnoId: string, cursoCodigo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/asistencia/registrar`, { alumnoId, cursoCodigo }).pipe(
      map((response: any) => {
        console.log('Respuesta del servidor al registrar presencia:', response);
        if (response.success) {
          const socket = io(this.socketUrl, {
            transports: ['polling', 'websocket'],
            upgrade: false,
            forceNew: true
          });
          socket.emit('nuevaAsistencia', { alumnoId });
          socket.disconnect();
        }
        return response;
      }),
      catchError((error) => {
        console.log('Error al registrar presencia:', error);
        return of({ success: false });
      })
    );
  }

  obtenerEstudiantes(docenteId: string, cursoCodigo: string): Observable<any> {
    return new Observable(observer => {
      const actualizarEstudiantes = () => {
        this.http.get(`${this.apiUrl}/asistencia/estudiantes/${docenteId}/${cursoCodigo}`).pipe(
          map((response: any) => {
            console.log('Estudiantes obtenidos:', response);
            observer.next(response);
            observer.complete();
          }),
          catchError((error) => {
            console.log('Error al obtener estudiantes:', error);
            observer.next([]);
            observer.complete();
            return of([]);
          })
        ).subscribe();
      };

      actualizarEstudiantes();

      console.log('Intentando conectar al socket...');
      const socket = io(this.socketUrl, {
        transports: ['polling', 'websocket'],
        upgrade: false,
        forceNew: true
      });

      socket.on('connect', () => {
        console.log('Cliente conectado');
      });

      socket.on('nuevaAsistencia', ({ alumnoId }: { alumnoId: string }) => {
        console.log(`Asistencia registrada para el alumno con ID: ${alumnoId}`);
        actualizarEstudiantes();
      });

      socket.on('disconnect', () => {
        console.log('Cliente desconectado');
      });

      return () => {
        console.log('Desconectando del socket...');
        socket.disconnect();
      };
    });
  }

  registerAlumno(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/alumno/register`, data);
  }
  loginAlumno(data: any): Observable<{ success: boolean, alumno?: any }> {
    console.log('Solicitud de inicio de sesión para alumno:', data);
    return this.http.post(`${this.apiUrl}/auth/alumno/login`, data).pipe(
      map((response: any) => {
        console.log('Respuesta del servidor:', response);
        if (response.message === 'Alumno autenticado') {
          localStorage.setItem('perfil', 'A');
          localStorage.setItem('Autenticacion', 'true');
          return { success: true, alumno: response.alumno };
        }
        return { success: false };
      }),
      catchError((error) => {
        console.log('Error del servidor:', error);
        return of({ success: false });
      })
    );
  }
  // Métodos para asistencia
  generarQR(): Observable<any> {
    const qr = require('qrcode');
    const url = `${this.apiUrl}/asistencia/registrar`; // Adaptar la URL de la API
    return new Observable(observer => {
      qr.toDataURL(url, (err: any, qrCodeUrl: any) => {
        if (err) {
          console.log('Error al generar el código QR:', err);
          observer.next({ success: false, error: 'Error al generar el código QR' });
          observer.complete();
        } else {
          console.log('Código QR generado:', url);
          observer.next({ success: true, url: qrCodeUrl });
          observer.complete();
        }
      });
    });
  }


}
