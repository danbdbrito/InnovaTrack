import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-historial-recorridos',
  templateUrl: './historial-recorridos.page.html',
  styleUrls: ['./historial-recorridos.page.scss'],
})
export class HistorialRecorridosPage implements OnInit {
  historialRecorridos: any[] = [];

  constructor() {}

  ngOnInit() {
    // Recuperamos el historial de recorridos desde localStorage
    this.historialRecorridos = JSON.parse(localStorage.getItem('historialRecorridos') || '[]');
  }
}
