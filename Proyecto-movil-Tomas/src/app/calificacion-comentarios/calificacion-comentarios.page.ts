import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calificacion-comentarios',
  templateUrl: './calificacion-comentarios.page.html',
  styleUrls: ['./calificacion-comentarios.page.scss'],
})
export class CalificacionComentariosPage implements OnInit {

  historialRecorridos: any[] = [];
  calificados: any[] = [];

  constructor() { }

  ngOnInit() {
    const data = localStorage.getItem('historialRecorridos');
    this.historialRecorridos = data ? JSON.parse(data) : [];

    // Filtrar solo los que tienen calificación > 0
    this.calificados = this.historialRecorridos.filter(r => r.calificacion && r.calificacion > 0);
  }

}
