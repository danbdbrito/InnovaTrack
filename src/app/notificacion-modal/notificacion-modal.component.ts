import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-notificacion-modal',
  templateUrl: './notificacion-modal.component.html',
  styleUrls: ['./notificacion-modal.component.scss'],
})
export class NotificacionModalComponent implements OnInit {
  @Input() horario: any;
  @Input() index: number;
  
  tiempoSeleccionado: number | null = null;
  mensajePersonalizado: string = '';

  constructor(
    private modalController: ModalController,
    private alertController: AlertController
  ) { }

  ngOnInit() {}

  cerrar() {
    this.modalController.dismiss();
  }

  async confirmar() {
    // Validar tiempo seleccionado
    if (!this.tiempoSeleccionado || ![1, 5, 10, 15].includes(this.tiempoSeleccionado)) {
      await this.mostrarAlerta('Error', 'Por favor selecciona un tiempo de anticipación válido.');
      return;
    }

    // Validar que no haya duplicados
    const notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
    const yaExiste = notificaciones.some((n: any) => 
      n.horario.bus === this.horario.bus && 
      n.horario.ruta === this.horario.ruta && 
      n.horario.horaSalida === this.horario.horaSalida && 
      n.tiempo === this.tiempoSeleccionado
    );

    if (yaExiste) {
      await this.mostrarAlerta(
        'Notificación Duplicada', 
        'Ya existe un recordatorio para este bus, ruta, hora y tiempo de aviso.'
      );
      return;
    }

    // Crear nueva notificación
    const nuevaNotificacion = {
      id: Date.now(), // ID único para la notificación
      horario: this.horario,
      tiempo: this.tiempoSeleccionado,
      mensaje: this.mensajePersonalizado.trim(),
      fechaCreacion: new Date().toISOString()
    };

    notificaciones.push(nuevaNotificacion);
    localStorage.setItem('notificaciones', JSON.stringify(notificaciones));

    // Mostrar confirmación
    await this.mostrarAlerta(
      'Notificación Configurada', 
      `Se ha configurado tu recordatorio para ${this.tiempoSeleccionado} minuto${this.tiempoSeleccionado > 1 ? 's' : ''} antes del bus ${this.horario.bus}.`,
      'success'
    );

    // Cerrar modal con datos
    this.modalController.dismiss({
      tiempo: this.tiempoSeleccionado,
      horario: this.horario,
      mensaje: this.mensajePersonalizado.trim(),
      notificacion: nuevaNotificacion
    });
  }

  private async mostrarAlerta(titulo: string, mensaje: string, tipo: 'error' | 'success' = 'error') {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
      cssClass: tipo === 'success' ? 'alert-success' : 'alert-error'
    });

    await alert.present();
  }

  // Método helper para obtener el texto del tiempo seleccionado
  get tiempoTexto(): string {
    if (!this.tiempoSeleccionado) return '';
    return `${this.tiempoSeleccionado} minuto${this.tiempoSeleccionado > 1 ? 's' : ''} antes`;
  }

  // Método helper para verificar si el formulario es válido
  get esFormularioValido(): boolean {
    return this.tiempoSeleccionado !== null && [1, 5, 10, 15].includes(this.tiempoSeleccionado);
  }
}