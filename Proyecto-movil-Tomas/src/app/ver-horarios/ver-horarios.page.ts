import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { NotificacionModalComponent } from '../notificacion-modal/notificacion-modal.component';

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
  filtroComuna = '';
  filtroFecha = '';
  filtroHora = '';
  horasDisponibles: string[] = [];
  busesDisponibles: string[] = [];
  comunasDisponibles: string[] = [];
  fechasDisponibles: string[] = [];

  detalleIndex: number | null = null;
  tarifaFicticia: number = 1200; // Valor ficticio de la tarifa
  mostrarMensajeOtro: boolean = false;

  constructor(private toastController: ToastController, private router: Router, private modalController: ModalController) {}

  ngOnInit() {
    this.cargarHorarios();
  }

  ionViewWillEnter() {
    this.cargarHorarios();
  }

  ionViewDidEnter() {
    // Refrescar la página cada 3 segundos
    this.iniciarActualizacionAutomatica();
  }

  ionViewWillLeave() {
    // Detener la actualización automática cuando se sale de la página
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  intervalId: any = null;

  iniciarActualizacionAutomatica() {
    // Limpiar intervalo anterior si existe
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      this.cargarHorarios();
      // Reaplicar filtros si están activos
      if (this.filtroBus || this.filtroComuna || this.filtroFecha || this.filtroHora) {
        this.aplicarFiltro();
      }
      // Actualizar las opciones disponibles
      this.obtenerBusesDisponibles();
      this.obtenerComunasDisponibles();
      this.obtenerFechasDisponibles();
      this.obtenerHorasDisponibles();
    }, 3000); // Actualizar cada 3 segundos
  }

  cargarHorarios() {
    // Cargar todos los horarios guardados
    this.horarios = JSON.parse(localStorage.getItem('historialRecorridos') || '[]');
    const hoy = new Date();
    // Filtrar y eliminar los horarios con fecha de salida anterior a hoy
    this.horarios = this.horarios.filter(horario => {
      if (!horario.fechaSalida) return true;
      const [anio, mes, dia] = horario.fechaSalida.split('-').map(Number);
      const fechaSalida = new Date(anio, mes - 1, dia);
      return fechaSalida >= new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    });
    localStorage.setItem('historialRecorridos', JSON.stringify(this.horarios));
    this.horariosFiltrados = [...this.horarios];
    
    // Obtener horas disponibles únicas
    this.obtenerHorasDisponibles();
    this.obtenerBusesDisponibles();
    this.obtenerComunasDisponibles();
    this.obtenerFechasDisponibles();
    
    // Recuperar selección previa y actualizar el objeto si es necesario
    const seleccionado = localStorage.getItem('horarioSeleccionado');
    if (seleccionado !== null) {
      this.seleccionadoIndex = parseInt(seleccionado, 10);
      if (!isNaN(this.seleccionadoIndex) && this.horarios[this.seleccionadoIndex]) {
        // Actualizar el objeto guardado con los datos más recientes
        localStorage.setItem('horarioSeleccionadoObj', JSON.stringify(this.horarios[this.seleccionadoIndex]));
        this.mensajeConfirmacion = `Horario "${this.horarios[this.seleccionadoIndex].horaSalida}" seleccionado correctamente.`;
      } else {
        this.seleccionadoIndex = null;
        localStorage.removeItem('horarioSeleccionado');
        localStorage.removeItem('horarioSeleccionadoObj');
      }
    }
  }

  obtenerHorasDisponibles() {
    const horas = this.horarios.map(horario => horario.horaSalida).filter(hora => hora);
    this.horasDisponibles = [...new Set(horas)].sort();
  }

  obtenerBusesDisponibles() {
    const buses = this.horarios.map(horario => horario.bus).filter(bus => bus);
    this.busesDisponibles = [...new Set(buses)].sort();
  }

  obtenerComunasDisponibles() {
    const comunas = this.horarios.map(horario => horario.comuna).filter(comuna => comuna);
    this.comunasDisponibles = [...new Set(comunas)].sort();
  }

  obtenerFechasDisponibles() {
    const fechas = this.horarios.map(horario => horario.fechaSalida).filter(fecha => fecha);
    this.fechasDisponibles = [...new Set(fechas)].sort();
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
      // Filtro por bus
      const cumpleBus = !this.filtroBus || 
        horario.bus.toLowerCase().includes(this.filtroBus.toLowerCase());
      
      // Filtro por comuna
      const cumpleComuna = !this.filtroComuna || 
        horario.comuna.toLowerCase().includes(this.filtroComuna.toLowerCase());
      
      // Filtro por fecha
      const cumpleFecha = !this.filtroFecha || 
        horario.fechaSalida === this.filtroFecha;
      
      // Filtro por hora
      const cumpleHora = !this.filtroHora || 
        horario.horaSalida === this.filtroHora;
      
      // Todos los filtros deben cumplirse (AND lógico)
      return cumpleBus && cumpleComuna && cumpleFecha && cumpleHora;
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
    this.filtroComuna = '';
    this.filtroFecha = '';
    this.filtroHora = '';
    this.horariosFiltrados = [...this.horarios];
    this.mostrarFiltro = false;
    // Actualizar las opciones disponibles
    this.obtenerBusesDisponibles();
    this.obtenerComunasDisponibles();
    this.obtenerFechasDisponibles();
    this.obtenerHorasDisponibles();
  }

  async mostrarDetalle(index: number) {
    try {
      const horario = this.horariosFiltrados[index];
      if (!horario || horario.tarifa === undefined || horario.tarifa === null) {
        throw new Error('No se pudo cargar la tarifa');
      }
      if (this.detalleIndex === index) {
        this.detalleIndex = null;
      } else {
        this.detalleIndex = index;
      }
    } catch (error) {
      this.detalleIndex = null;
      const toast = await this.toastController.create({
        message: 'No se pudo cargar la tarifa. Por favor, vuelva a intentarlo.',
        duration: 2500,
        color: 'danger',
        position: 'top'
      });
      toast.present();
    }
  }

  obtenerTarifas(horario: any) {
    let tarifaBase = Number(horario.tarifa) || 0;
    // Definir horario punta: 07:00-09:00 y 18:00-20:00
    let esPunta = false;
    if (horario.horaSalida) {
      const hora = horario.horaSalida.split(':');
      const h = parseInt(hora[0], 10);
      const m = parseInt(hora[1], 10);
      // Horario punta: 07:00-09:00 y 18:00-20:00
      esPunta = (h >= 7 && h < 9) || (h >= 18 && h < 20);
    }
    if (esPunta) {
      tarifaBase = Math.round(tarifaBase * 1.2); // 20% extra en punta
    }
    const tarifaNormal = tarifaBase;
    const tarifaAdultoMayor = Math.round(tarifaBase * 0.5);
    const tarifaEstudiante = Math.round(tarifaBase * 0.67);
    return { tarifaNormal, tarifaAdultoMayor, tarifaEstudiante, esPunta };
  }

  irATarifaBus(horario: any) {
    this.router.navigate(['/tarifa-bus'], { queryParams: { horario: JSON.stringify(horario) } });
  }

  async abrirNotificacionModal(horario: any, index: number) {
    const modal = await this.modalController.create({
      component: NotificacionModalComponent,
      componentProps: { horario, index }
    });
    await modal.present();
  }

  onBusChange(event: any) {
    if (event.detail.value === 'otro') {
      this.mostrarMensajeOtro = true;
      // Ocultar el mensaje después de 5 segundos
      setTimeout(() => {
        this.mostrarMensajeOtro = false;
        this.filtroBus = ''; // Limpiar la selección
      }, 5000);
    } else {
      this.mostrarMensajeOtro = false;
    }
  }
}
