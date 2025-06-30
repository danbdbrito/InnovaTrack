import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {
  notificaciones: any[] = [];

  constructor(private router: Router) { }

  ngOnInit() {
    this.cargarNotificaciones();
  }

  ionViewWillEnter() {
    this.cargarNotificaciones();
  }

  cargarNotificaciones() {
    this.notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
  }

  cancelarNotificacion(index: number) {
    this.notificaciones.splice(index, 1);
    localStorage.setItem('notificaciones', JSON.stringify(this.notificaciones));
  }

  modificarNotificacion(index: number, nuevoTiempo: number) {
    // Ciclo de tiempos: 1 -> 5 -> 10 -> 15 -> 1
    let tiempoActual = this.notificaciones[index].tiempo;
    let siguienteTiempo: number;
    
    if (tiempoActual === 1) {
      siguienteTiempo = 5;
    } else if (tiempoActual === 5) {
      siguienteTiempo = 10;
    } else if (tiempoActual === 10) {
      siguienteTiempo = 15;
    } else {
      siguienteTiempo = 1;
    }
    
    this.notificaciones[index].tiempo = siguienteTiempo;
    localStorage.setItem('notificaciones', JSON.stringify(this.notificaciones));
  }

  volverAtras() {
    this.router.navigate(['/home-usuario']);
  }
}
