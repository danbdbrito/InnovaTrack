import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ver-horarios',
  templateUrl: './ver-horarios.page.html',
  styleUrls: ['./ver-horarios.page.scss'],
})
export class VerHorariosPage implements OnInit {
  horarios: any[] = [];
  horariosFiltrados: any[] = [];

  seleccionadoIndex: number | null = null;
  mensajeConfirmacion: string = '';

  mostrarFiltro = false;
  filtroBus = '';

  constructor() {}

  ngOnInit() {
    // Cargar todos los horarios guardados
    this.horarios = JSON.parse(localStorage.getItem('historialRecorridos') || '[]');
    this.horariosFiltrados = [...this.horarios];

    // Recuperar selección previa
    const seleccionado = localStorage.getItem('horarioSeleccionado');
    if (seleccionado !== null) {
      this.seleccionadoIndex = parseInt(seleccionado, 10);
      if (!isNaN(this.seleccionadoIndex) && this.horarios[this.seleccionadoIndex]) {
        this.mensajeConfirmacion = `Horario "${this.horarios[this.seleccionadoIndex].horaSalida}" seleccionado correctamente.`;
      } else {
        this.seleccionadoIndex = null;
      }
    }
  }

 seleccionarHorario(index: number) {
  if (this.seleccionadoIndex === index) {
    // Si el usuario hace clic sobre el mismo, lo deselecciona
    this.seleccionadoIndex = null;
    localStorage.removeItem('horarioSeleccionado');
    localStorage.removeItem('horarioSeleccionadoObj');
    this.mensajeConfirmacion = 'Selección de horario cancelada.';
  } else {
    // Selección nueva
    this.seleccionadoIndex = index;
    localStorage.setItem('horarioSeleccionado', index.toString());
    localStorage.setItem('horarioSeleccionadoObj', JSON.stringify(this.horariosFiltrados[index]));
    this.mensajeConfirmacion = `Horario "${this.horariosFiltrados[index].horaSalida}" seleccionado correctamente.`;
  }
}


  aplicarFiltro() {
    this.horariosFiltrados = this.horarios.filter(horario => {
      return this.filtroBus
        ? horario.bus.toLowerCase().includes(this.filtroBus.toLowerCase())
        : true;
    });

    // Si el horario seleccionado ya no está en la lista filtrada, limpiar selección
    if (
      this.seleccionadoIndex !== null &&
      !this.horariosFiltrados.includes(this.horarios[this.seleccionadoIndex])
    ) {
      this.seleccionadoIndex = null;
      localStorage.removeItem('horarioSeleccionado');
      localStorage.removeItem('horarioSeleccionadoObj');
      this.mensajeConfirmacion = '';
    }
  }

  limpiarFiltro() {
    this.filtroBus = '';
    this.horariosFiltrados = [...this.horarios];
    this.mostrarFiltro = false;
  }
}
