import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tarifa-bus',
  templateUrl: './tarifa-bus.page.html',
  styleUrls: ['./tarifa-bus.page.scss'],
})
export class TarifaBusPage implements OnInit {
  horario: any = null;
  tarifas: any = null;
  horarioOriginal: any = null;
  intervalId: any = null;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['horario']) {
        this.horarioOriginal = JSON.parse(params['horario']);
        this.cargarDatosActualizados();
      }
    });
  }

  ionViewWillEnter() {
    // Recargar datos cada vez que se entra a la página
    if (this.horarioOriginal) {
      this.cargarDatosActualizados();
    }
    this.iniciarActualizacionAutomatica();
  }

  ionViewWillLeave() {
    // Detener la actualización automática cuando se sale de la página
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  iniciarActualizacionAutomatica() {
    // Limpiar intervalo anterior si existe
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      this.cargarDatosActualizados();
    }, 2000); // Actualizar cada 2 segundos
  }

  cargarDatosActualizados() {
    // Buscar el horario actualizado en el localStorage
    const historialRecorridos = JSON.parse(localStorage.getItem('historialRecorridos') || '[]');
    
    // Buscar el horario que coincida con los datos originales
    const horarioActualizado = historialRecorridos.find((h: any) => 
      h.bus === this.horarioOriginal.bus && 
      h.ruta === this.horarioOriginal.ruta && 
      h.horaSalida === this.horarioOriginal.horaSalida &&
      h.fechaSalida === this.horarioOriginal.fechaSalida
    );

    // Si se encuentra el horario actualizado, usarlo; si no, usar el original
    this.horario = horarioActualizado || this.horarioOriginal;
    this.calcularTarifas();
  }

  calcularTarifas() {
    let tarifaBase = Number(this.horario.tarifa) || 0;
    
    this.tarifas = {
      normal: tarifaBase,
      adultoMayor: Math.round(tarifaBase * 0.5),
      estudiante: Math.round(tarifaBase * 0.67)
    };
  }

  volverAtras() {
    this.router.navigate(['/ver-horarios']);
  }
}
