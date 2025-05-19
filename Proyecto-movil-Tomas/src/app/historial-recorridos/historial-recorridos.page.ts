import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial-recorridos',
  templateUrl: './historial-recorridos.page.html',
  styleUrls: ['./historial-recorridos.page.scss'],
})
export class HistorialRecorridosPage implements OnInit {
  historialRecorridos: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.cargarRecorridos();
  }

  cargarRecorridos() {
    this.historialRecorridos = JSON.parse(localStorage.getItem('historialRecorridos') || '[]');
  }

  editarRecorrido(index: number) {
    this.router.navigate(['/crear-recorrido'], { queryParams: { index } });
  }

  eliminarRecorrido(index: number) {
    this.historialRecorridos.splice(index, 1);  // Elimina del array
    localStorage.setItem('historialRecorridos', JSON.stringify(this.historialRecorridos));  // Actualiza storage
  }
}
