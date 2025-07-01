import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial-recorridos',
  templateUrl: './historial-recorridos.page.html',
  styleUrls: ['./historial-recorridos.page.scss'],
})
export class HistorialRecorridosPage implements OnInit {
  historialRecorridos: any[] = [];
  ultimoHorarioMostrado: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.cargarRecorridos();
  }

  ionViewWillEnter() {
    this.cargarRecorridos();
  }

  cargarRecorridos() {
    this.historialRecorridos = JSON.parse(localStorage.getItem('historialRecorridos') || '[]');
  }

  editarRecorrido(index: number) {
    this.router.navigate(['/crear-recorrido'], { queryParams: { index } });
  }

  eliminarRecorrido(index: number) {
    const recorridoEliminado = this.historialRecorridos[index];
    const horarioSeleccionado = localStorage.getItem('horarioSeleccionado');
    const eraHorarioSeleccionado = horarioSeleccionado && parseInt(horarioSeleccionado, 10) === index;

    if (recorridoEliminado) {
      const numeroBus = recorridoEliminado.bus
        ? (recorridoEliminado.bus.includes(' ')
            ? recorridoEliminado.bus.split(' ')[1]
            : recorridoEliminado.bus)
        : 'N/A';

      const mensajeEliminacion = {
        bus: recorridoEliminado.bus || 'N/A',
        numeroBus,
        horaSalida: recorridoEliminado.horaSalida || 'N/A',
        comuna: recorridoEliminado.comuna || 'N/A',
        fechaSalida: recorridoEliminado.fechaSalida || 'N/A',
        eraSeleccionado: eraHorarioSeleccionado,
        timestamp: new Date().getTime()
      };

      localStorage.setItem('recorridoEliminado', JSON.stringify(mensajeEliminacion));
    }

    if (eraHorarioSeleccionado) {
      localStorage.removeItem('horarioSeleccionado');
      localStorage.removeItem('horarioSeleccionadoObj');
    }

    this.historialRecorridos.splice(index, 1);
    localStorage.setItem('historialRecorridos', JSON.stringify(this.historialRecorridos));
  }

  mostrarToastCambioHorario() {
    // Implementa la lógica para mostrar el toast aquí
  }
}