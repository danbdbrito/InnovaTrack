import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.page.html',
  styleUrls: ['./calificacion.page.scss'],
})
export class CalificacionPage implements OnInit {

  historialRecorridos: any[] = [];
  recorridoSeleccionadoIndex: number | null = null;
  recorridoSeleccionado: any = null;

  calificacion: number = 0;
  comentario: string = '';

  private readonly CLAVE_HISTORIAL = 'historialRecorridos';

  constructor() { }

  ngOnInit() {
    const data = localStorage.getItem(this.CLAVE_HISTORIAL);
    this.historialRecorridos = data ? JSON.parse(data) : [];
  }

  cargarRecorridoSeleccionado() {
    if (this.recorridoSeleccionadoIndex !== null) {
      this.recorridoSeleccionado = this.historialRecorridos[this.recorridoSeleccionadoIndex];
      this.calificacion = this.recorridoSeleccionado.calificacion || 0;
      this.comentario = this.recorridoSeleccionado.comentario || '';
    } else {
      this.recorridoSeleccionado = null;
      this.calificacion = 0;
      this.comentario = '';
    }
  }

  seleccionarCalificacion(valor: number) {
    this.calificacion = valor;
  }

  guardarCalificacion() {
    if (this.recorridoSeleccionadoIndex === null) {
      alert('Por favor selecciona un recorrido para calificar.');
      return;
    }

    // Actualizar datos del recorrido
    this.historialRecorridos[this.recorridoSeleccionadoIndex].calificacion = this.calificacion;
    this.historialRecorridos[this.recorridoSeleccionadoIndex].comentario = this.comentario;

    // Guardar en localStorage
    localStorage.setItem(this.CLAVE_HISTORIAL, JSON.stringify(this.historialRecorridos));

    alert('Calificación guardada correctamente.');
  }

}
