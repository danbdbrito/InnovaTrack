import { Component, OnInit } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-crear-recorrido',
  templateUrl: './crear-recorrido.page.html',
  styleUrls: ['./crear-recorrido.page.scss'],
})
export class CrearRecorridoPage implements OnInit {
  recorridoForm: FormGroup;
  buses = ['Bus 101', 'Bus 205', 'Bus 307', 'Bus 403', 'Bus 411', 'Bus 401', 'Bus 211', 'Bus 670', 'Bus 342', 'Bus 666'];
  
  rutas = ['Ruta 1', 'Ruta 2', 'Ruta 3', 'Ruta 4', 'Ruta 5', 'Ruta 6', 'Ruta 7'];

  paradasPorRuta: { [key: string]: { nombre: string, descripcion?: string }[] } = {
    'Ruta 1': [
      { nombre: 'Parada Central', descripcion: 'Plaza principal' },
      { nombre: 'Parada Norte', descripcion: 'Cerca del mercado' },
      { nombre: 'Parada Este', descripcion: 'Frente a la estación' }
    ],
    'Ruta 2': [
      { nombre: 'Parada Sur', descripcion: 'Parque de la ciudad' },
      { nombre: 'Parada Oeste', descripcion: 'Hospital General' },
      { nombre: 'Parada Centro Histórico', descripcion: 'Museo local' }
    ],
    'Ruta 3': [
      { nombre: 'Parada Universidad', descripcion: 'Entrada principal' },
      { nombre: 'Parada Biblioteca', descripcion: 'Biblioteca central' },
      { nombre: 'Parada Estadio', descripcion: 'Estadio municipal' }
    ],
    'Ruta 4': [
      { nombre: 'Parada Terminal', descripcion: 'Terminal de buses' },
      { nombre: 'Parada Shopping', descripcion: 'Centro comercial' },
      { nombre: 'Parada Iglesia', descripcion: 'Iglesia mayor' }
    ],
    'Ruta 5': [
      { nombre: 'Parada Plaza', descripcion: 'Plaza principal' },
      { nombre: 'Parada Parque', descripcion: 'Parque natural' },
      { nombre: 'Parada Mercado', descripcion: 'Mercado central' }
    ],
    'Ruta 6': [
      { nombre: 'Parada Escuela', descripcion: 'Escuela primaria' },
      { nombre: 'Parada Estación', descripcion: 'Estación de tren' },
      { nombre: 'Parada Centro Médico', descripcion: 'Clínica local' }
    ],
    'Ruta 7': [
      { nombre: 'Parada Barrio Alto', descripcion: 'Zona residencial' },
      { nombre: 'Parada Cine', descripcion: 'Cine local' },
      { nombre: 'Parada Estación de Policía', descripcion: 'Comisaría central' }
    ]
  };

  paradas: { nombre: string, descripcion?: string }[] = [];
  editIndex: number | null = null;

  comunas: string[] = [
    'Valparaíso', 'Viña del Mar', 'Concón', 'Quilpué', 'Villa Alemana', 'Quintero', 'Puchuncaví',
    'Casablanca', 'Algarrobo', 'Cartagena', 'El Quisco', 'El Tabo', 'San Antonio', 'Santo Domingo',
    'Isla de Pascua', 'Juan Fernández', 'La Calera', 'La Cruz', 'Limache', 'Nogales', 'Olmué',
    'Hijuelas', 'Petorca', 'Cabildo', 'Zapallar', 'Papudo', 'La Ligua', 'San Felipe', 'Catemu',
    'Llaillay', 'Panquehue', 'Putaendo', 'Santa María', 'Los Andes', 'Calle Larga', 'Rinconada', 'San Esteban'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.recorridoForm = this.fb.group({
      bus: ['', Validators.required],
      ruta: ['', Validators.required],
      fechaSalida: ['', Validators.required],
      horaSalida: ['', Validators.required],
      horaLlegada: ['', Validators.required],
      comuna: ['', Validators.required],
      paradasSeleccionadas: [[], Validators.required],
      tarifa: ['', [Validators.required, Validators.min(0)]],
    });

    this.recorridoForm.get('ruta')?.valueChanges.subscribe(selectedRuta => {
      this.paradas = this.paradasPorRuta[selectedRuta] || [];
      // Limpiamos la selección de paradas cuando cambia la ruta
      this.recorridoForm.patchValue({ paradasSeleccionadas: [] });
    });

    this.route.queryParams.subscribe(params => {
      if (params['index'] !== undefined) {
        this.editIndex = +params['index'];
        this.cargarDatosParaEditar();
      }
    });
  }

  cargarDatosParaEditar() {
    const historialRecorridos = JSON.parse(localStorage.getItem('historialRecorridos') || '[]');
    const recorrido = historialRecorridos[this.editIndex!];
    if (recorrido) {
      this.recorridoForm.patchValue({
        bus: recorrido.bus,
        ruta: recorrido.ruta,
        fechaSalida: recorrido.fechaSalida || '',
        horaSalida: recorrido.horaSalida,
        horaLlegada: recorrido.horaLlegada || '',
        comuna: recorrido.comuna || '',
        paradasSeleccionadas: recorrido.paradasSeleccionadas || [],
        tarifa: recorrido.tarifa || ''
      });
      this.paradas = this.paradasPorRuta[recorrido.ruta] || [];
    }
  }

  guardarRecorrido() {
    if (this.recorridoForm.valid) {
      const datos = this.recorridoForm.value;
      // Validar que la fecha de salida no sea anterior a hoy (solo comparar año, mes y día)
      const hoy = new Date();
      const [anio, mes, dia] = datos.fechaSalida.split('-').map(Number);
      const fechaSalida = new Date(anio, mes - 1, dia);
      const fechaHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      if (fechaSalida < fechaHoy) {
        alert('La fecha de salida no puede ser anterior a la fecha actual.');
        return;
      }
      
      const historialRecorridos = JSON.parse(localStorage.getItem('historialRecorridos') || '[]');
      const recorridoAnterior = this.editIndex !== null ? historialRecorridos[this.editIndex] : null;
      
      if (this.editIndex !== null) {
        historialRecorridos[this.editIndex] = datos;
        
        // Actualizar horarioSeleccionadoObj si este es el horario seleccionado
        const horarioSeleccionado = localStorage.getItem('horarioSeleccionado');
        if (horarioSeleccionado && parseInt(horarioSeleccionado) === this.editIndex) {
          localStorage.setItem('horarioSeleccionadoObj', JSON.stringify(datos));
        }
        
        // Actualizar notificaciones si el recorrido anterior tenía notificaciones
        if (recorridoAnterior) {
          this.actualizarNotificaciones(recorridoAnterior, datos);
        }
        
        alert('Recorrido actualizado exitosamente');
      } else {
        historialRecorridos.push(datos);
        alert('Recorrido registrado exitosamente');
      }
      
      localStorage.setItem('historialRecorridos', JSON.stringify(historialRecorridos));
      this.router.navigate(['/historial-recorridos']);
    }
  }

  actualizarNotificaciones(recorridoAnterior: any, recorridoNuevo: any) {
    const notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
    let notificacionesActualizadas = false;
    
    // Buscar y actualizar notificaciones que coincidan con el recorrido anterior
    notificaciones.forEach((notificacion: any) => {
      if (notificacion.horario.bus === recorridoAnterior.bus && 
          notificacion.horario.ruta === recorridoAnterior.ruta && 
          notificacion.horario.horaSalida === recorridoAnterior.horaSalida) {
        
        // Actualizar la información del horario en la notificación
        notificacion.horario = {
          bus: recorridoNuevo.bus,
          ruta: recorridoNuevo.ruta,
          horaSalida: recorridoNuevo.horaSalida,
          horaLlegada: recorridoNuevo.horaLlegada,
          comuna: recorridoNuevo.comuna,
          fechaSalida: recorridoNuevo.fechaSalida,
          tarifa: recorridoNuevo.tarifa
        };
        notificacionesActualizadas = true;
      }
    });
    
    if (notificacionesActualizadas) {
      localStorage.setItem('notificaciones', JSON.stringify(notificaciones));
    }
  }

  irAlHistorial() {
    this.router.navigate(['/historial-recorridos']);
  }
}
