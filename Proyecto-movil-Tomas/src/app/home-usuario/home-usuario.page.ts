import { Component, OnInit } from '@angular/core';
import { AuthenticaService } from '../authentica.service';
import { Router } from '@angular/router';
import { StorageService } from '../storageS.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home-usuario',
  templateUrl: './home-usuario.page.html',
  styleUrls: ['./home-usuario.page.scss'],
})
export class HomeUsuarioPage implements OnInit {
  userName: string;
  horarioSeleccionado: any = null;
  ultimoHorarioMostrado: any = null;
  mensajeCambioHorario: string = '';
  mensajeNotificacion: string = '';
  mensajeEliminacion: string = '';
  intervalId: any = null;
  notificacionIntervalId: any = null;

  constructor(
    public route: Router,
    public authService: AuthenticaService,
    private storageService: StorageService,
    private toastController: ToastController
  ) {}

  async ngOnInit(): Promise<void> {
    await this.initUserName();
    this.cargarHorarioSeleccionado();
    this.limpiarNotificacionesMostradas();
  }

  ionViewWillEnter(): void {
    this.cargarHorarioSeleccionado();
  }

  ionViewDidEnter(): void {
    this.verificarCambiosPeriodicamente();
    this.verificarNotificaciones();
  }

  ionViewWillLeave(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.notificacionIntervalId) {
      clearInterval(this.notificacionIntervalId);
      this.notificacionIntervalId = null;
    }
  }

  gocrearrecorrido() {
    this.route.navigate(['/crear-recorrido']);
  }

  private async initUserName(): Promise<void> {
    try {
      const storedUser = await this.storageService.get('user');
      if (storedUser) {
        this.setUserName(storedUser.displayName);
      } else {
        await this.fetchAndStoreUserProfile();
      }
    } catch (error) {
      console.error('Error initializing user name:', error);
      this.setUserName('Usuario');
    }
  }

  private async fetchAndStoreUserProfile(): Promise<void> {
    try {
      const user = await this.authService.getProfile();
      if (user) {
        this.setUserName(user.displayName);
        await this.storageService.set('user', {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
        });
      } else {
        this.setUserName('Usuario');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      this.setUserName('Usuario');
    }
  }

  private setUserName(displayName: string | undefined): void {
    this.userName = displayName || 'Usuario';
  }

  cargarHorarioSeleccionado() {
    const horarioJson = localStorage.getItem('horarioSeleccionadoObj');
    let mostrarToast = false;
    if (horarioJson) {
      const horario = JSON.parse(horarioJson);
      if (horario.fechaSalida) {
        const [anio, mes, dia] = horario.fechaSalida.split('-').map(Number);
        const fechaSalida = new Date(anio, mes - 1, dia);
        const hoy = new Date();
        const fechaHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        if (fechaSalida < fechaHoy) {
          localStorage.removeItem('horarioSeleccionado');
          localStorage.removeItem('horarioSeleccionadoObj');
          this.horarioSeleccionado = null;
          this.ultimoHorarioMostrado = null;
          return;
        }
      }
      if (this.ultimoHorarioMostrado && (
        this.ultimoHorarioMostrado.horaSalida !== horario.horaSalida ||
        this.ultimoHorarioMostrado.horaLlegada !== horario.horaLlegada
      )) {
        mostrarToast = true;
      }
      this.horarioSeleccionado = horario;
      this.ultimoHorarioMostrado = JSON.parse(JSON.stringify(horario));
      if (mostrarToast) {
        this.mostrarToastCambioHorario();
      }
    } else {
      this.horarioSeleccionado = null;
      this.ultimoHorarioMostrado = null;
    }
  }

  async mostrarToastCambioHorario() {
    this.mensajeCambioHorario = `¡Horario actualizado! Nueva hora de salida: ${this.horarioSeleccionado.horaSalida} | Nueva hora de llegada: ${this.horarioSeleccionado.horaLlegada}`;
    setTimeout(() => {
      this.mensajeCambioHorario = '';
    }, 15000);
  }

  verificarCambiosPeriodicamente() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      const horarioJson = localStorage.getItem('horarioSeleccionadoObj');
      if (horarioJson) {
        const horarioActual = JSON.parse(horarioJson);
        if (this.horarioSeleccionado && (
          this.horarioSeleccionado.horaSalida !== horarioActual.horaSalida ||
          this.horarioSeleccionado.horaLlegada !== horarioActual.horaLlegada ||
          this.horarioSeleccionado.comuna !== horarioActual.comuna
        )) {
          this.cargarHorarioSeleccionado();
        }
      }
      
      // Verificar si se eliminó un recorrido
      this.verificarRecorridoEliminado();
    }, 1000);
  }

  verificarRecorridoEliminado() {
    const recorridoEliminadoJson = localStorage.getItem('recorridoEliminado');
    if (recorridoEliminadoJson) {
      const recorridoEliminado = JSON.parse(recorridoEliminadoJson);
      // Verificar si el mensaje es reciente (últimos 10 segundos)
      const ahora = new Date().getTime();
      if (ahora - recorridoEliminado.timestamp <= 10000) {
        this.mostrarMensajeEliminacion(recorridoEliminado);
        // Si el recorrido eliminado era el seleccionado, limpiar también las variables locales
        if (recorridoEliminado.eraSeleccionado) {
          this.horarioSeleccionado = null;
          this.ultimoHorarioMostrado = null;
        }
        localStorage.removeItem('recorridoEliminado'); // Limpiar después de mostrar
      }
    }
  }

  mostrarMensajeEliminacion(recorridoEliminado: any) {
    // Validar que todos los datos necesarios estén presentes
    const numeroBus = recorridoEliminado.numeroBus || 'N/A';
    const horaSalida = recorridoEliminado.horaSalida || 'N/A';
    const comuna = recorridoEliminado.comuna || 'N/A';
    const fechaSalida = recorridoEliminado.fechaSalida || 'N/A';
    
    let mensaje = `Se canceló el recorrido del bus ${numeroBus} (${horaSalida}) - ${comuna} - ${fechaSalida}`;
    
    if (recorridoEliminado.eraSeleccionado) {
      mensaje += ' - Este era su horario seleccionado';
    }
    
    this.mensajeEliminacion = mensaje;
    
    // Mostrar el mensaje por 15 segundos
    setTimeout(() => {
      this.mensajeEliminacion = '';
    }, 15000);
  }

  verificarNotificaciones() {
    if (this.notificacionIntervalId) {
      clearInterval(this.notificacionIntervalId);
    }
    this.notificacionIntervalId = setInterval(() => {
      this.verificarNotificacionesActivas();
    }, 30000); // Verificar cada 30 segundos
  }

  verificarNotificacionesActivas() {
    const notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
    const horarioSeleccionado = this.horarioSeleccionado;
    
    if (!horarioSeleccionado || !horarioSeleccionado.fechaSalida || !horarioSeleccionado.horaSalida) {
      return;
    }

    const ahora = new Date();
    const [anio, mes, dia] = horarioSeleccionado.fechaSalida.split('-').map(Number);
    const [hora, minuto] = horarioSeleccionado.horaSalida.split(':').map(Number);
    const fechaHoraSalida = new Date(anio, mes - 1, dia, hora, minuto);
    
    // Verificar cada notificación
    notificaciones.forEach((notificacion: any) => {
      if (notificacion.horario.bus === horarioSeleccionado.bus && 
          notificacion.horario.horaSalida === horarioSeleccionado.horaSalida) {
        
        const tiempoAnticipacion = notificacion.tiempo * 60 * 1000; // Convertir a milisegundos
        const tiempoNotificacion = new Date(fechaHoraSalida.getTime() - tiempoAnticipacion);
        
        // Si estamos en el momento de mostrar la notificación (con un margen de 1 minuto)
        const diferencia = ahora.getTime() - tiempoNotificacion.getTime();
        if (diferencia >= 0 && diferencia <= 60000) { // 1 minuto de margen
          // Verificar si ya se mostró esta notificación
          const notificacionesMostradas = JSON.parse(localStorage.getItem('notificacionesMostradas') || '[]');
          const claveNotificacion = `${notificacion.horario.bus}-${notificacion.horario.horaSalida}-${notificacion.tiempo}`;
          
          if (!notificacionesMostradas.includes(claveNotificacion)) {
            this.mostrarNotificacionTiempo(notificacion, horarioSeleccionado);
            // Marcar como mostrada
            notificacionesMostradas.push(claveNotificacion);
            localStorage.setItem('notificacionesMostradas', JSON.stringify(notificacionesMostradas));
          }
        }
      }
    });
  }

  async mostrarNotificacionTiempo(notificacion: any, horario: any) {
    const numeroBus = horario.bus.split(' ')[1] || horario.bus; // Extraer número del bus
    let mensaje = `Quedan ${notificacion.tiempo} minutos para su bus ${numeroBus} (${horario.horaSalida})`;
    
    if (notificacion.mensaje && notificacion.mensaje.trim()) {
      mensaje += ` - ${notificacion.mensaje}`;
    }
    
    this.mensajeNotificacion = mensaje;
    
    // Mostrar el mensaje por 1 minuto
    setTimeout(() => {
      this.mensajeNotificacion = '';
    }, 60000);
  }

  limpiarNotificacionesMostradas() {
    const hoy = new Date().toDateString();
    const ultimaLimpieza = localStorage.getItem('ultimaLimpiezaNotificaciones');
    
    if (ultimaLimpieza !== hoy) {
      localStorage.removeItem('notificacionesMostradas');
      localStorage.setItem('ultimaLimpiezaNotificaciones', hoy);
    }
  }
}
