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
    // Verificar si este recorrido es el horario seleccionado actualmente
    const horarioSeleccionado = localStorage.getItem('horarioSeleccionado');
    if (horarioSeleccionado && parseInt(horarioSeleccionado) === index) {
      // Marcar que se está editando el horario seleccionado
      localStorage.setItem('editandoHorarioSeleccionado', 'true');
    }
    
    this.router.navigate(['/crear-recorrido'], { queryParams: { index } });
  }

  eliminarRecorrido(index: number) {
    const recorridoEliminado = this.historialRecorridos[index];
    
    // Verificar si este recorrido es el horario seleccionado actualmente
    const horarioSeleccionado = localStorage.getItem('horarioSeleccionado');
    const eraHorarioSeleccionado = horarioSeleccionado && parseInt(horarioSeleccionado) === index;
    
    // Guardar información del recorrido eliminado para mostrar en home-usuario
    if (recorridoEliminado) {
      // Asegurar que se extraiga correctamente el número del bus
      const numeroBus = recorridoEliminado.bus ? 
        (recorridoEliminado.bus.includes(' ') ? recorridoEliminado.bus.split(' ')[1] : recorridoEliminado.bus) : 
        'N/A';
      
      const mensajeEliminacion = {
        bus: recorridoEliminado.bus || 'N/A',
        numeroBus: numeroBus,
        horaSalida: recorridoEliminado.horaSalida || 'N/A',
        comuna: recorridoEliminado.comuna || 'N/A',
        fechaSalida: recorridoEliminado.fechaSalida || 'N/A',
        eraSeleccionado: eraHorarioSeleccionado,
        timestamp: new Date().getTime()
      };
      
      localStorage.setItem('recorridoEliminado', JSON.stringify(mensajeEliminacion));
    }
    
    // Si era el horario seleccionado, limpiar la selección
    if (eraHorarioSeleccionado) {
      localStorage.removeItem('horarioSeleccionado');
      localStorage.removeItem('horarioSeleccionadoObj');
    }
    
    this.historialRecorridos.splice(index, 1);  // Elimina del array
    localStorage.setItem('historialRecorridos', JSON.stringify(this.historialRecorridos));  // Actualiza storage
  }

  mostrarToastCambioHorario() {
    // Implementa la lógica para mostrar el toast aquí
  }
}
