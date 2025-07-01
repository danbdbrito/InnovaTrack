import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-historial-usuario',
  templateUrl: './historial-usuario.page.html',
  styleUrls: ['./historial-usuario.page.scss'],
})
export class HistorialUsuarioPage implements OnInit {
  historialRecorridos: any[] = [];

  constructor() {}

  ngOnInit() {
    this.cargarRecorridos();
  }

  ionViewWillEnter() {
    this.cargarRecorridos();
  }

  private cargarRecorridos() {
    this.historialRecorridos = JSON.parse(localStorage.getItem('historialRecorridos') || '[]');
  }
}