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
      tarifaReferencial: [{ value: '', disabled: true }],
      descuentoPorcentaje: [0, [Validators.min(0), Validators.max(100)]],
      tarifaTotal: [{ value: '', disabled: true }]
    });

    // Detectar modo edición
    this.route.queryParams.subscribe(params => {
      if (params['index'] !== undefined) {
        this.editIndex = +params['index'];
        this.cargarDatosParaEditar();
      }
    });

    // Recalculaciones en creación
    this.recorridoForm.get('tarifa')!.valueChanges.subscribe(() => {
      this.actualizarReferencial();
      this.actualizarTotal();
    });
    this.recorridoForm.get('horaSalida')!.valueChanges.subscribe(() => this.actualizarReferencial());
    this.recorridoForm.get('descuentoPorcentaje')!.valueChanges.subscribe(() => this.actualizarTotal());

    // Al cambiar ruta, recargar paradas
    this.recorridoForm.get('ruta')?.valueChanges.subscribe(selectedRuta => {
      this.paradas = this.paradasPorRuta[selectedRuta] || [];
      this.recorridoForm.patchValue({ paradasSeleccionadas: [] });
    });
  }

  private actualizarReferencial() {
    if (this.editIndex !== null) return;
    const tarifaVal = Number(this.recorridoForm.get('tarifa')!.value) || 0;
    const horaStr = this.recorridoForm.get('horaSalida')!.value || '';
    let factor = 1;
    if (horaStr) {
      const [h] = horaStr.split(':').map(Number);
      if ((h >= 7 && h < 9) || (h >= 18 && h < 20)) factor = 1.2;
    }
    const referencial = Math.round(tarifaVal * factor);
    this.recorridoForm.patchValue({ tarifaReferencial: referencial }, { emitEvent: false });
  }

  private actualizarTotal() {
    const tarifaVal = Number(this.recorridoForm.get('tarifa')!.value) || 0;
    const descuento = Number(this.recorridoForm.get('descuentoPorcentaje')!.value) || 0;
    const total = Math.round(tarifaVal * (1 - descuento / 100));
    this.recorridoForm.patchValue({ tarifaTotal: total }, { emitEvent: false });
  }

  cargarDatosParaEditar() {
    const historial = JSON.parse(localStorage.getItem('historialRecorridos') || '[]');
    const rec = historial[this.editIndex!];
    if (!rec) return;
    this.recorridoForm.patchValue({
      bus: rec.bus,
      ruta: rec.ruta,
      fechaSalida: rec.fechaSalida,
      horaSalida: rec.horaSalida,
      horaLlegada: rec.horaLlegada,
      comuna: rec.comuna,
      paradasSeleccionadas: rec.paradasSeleccionadas || [],
      tarifa: rec.tarifa,
      tarifaReferencial: rec.tarifaReferencial,
      descuentoPorcentaje: rec.descuentoPorcentaje || 0,
      tarifaTotal: rec.tarifaTotal || rec.tarifa
    });
    this.paradas = this.paradasPorRuta[rec.ruta] || [];
  }

  guardarRecorrido() {
    if (!this.recorridoForm.valid) return;

    // Validar fecha de salida
    const datosForm: any = this.recorridoForm.getRawValue();
    const [a, m, d] = datosForm.fechaSalida.split('-').map(Number);
    const fechaSalida = new Date(a, m - 1, d);
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    if (fechaSalida < hoy) {
      alert('La fecha de salida no puede ser anterior a la fecha actual.');
      return;
    }

    const historial = JSON.parse(localStorage.getItem('historialRecorridos') || '[]');
    const ahora = new Date().toISOString();
    let nuevoRegistro: any;

    if (this.editIndex !== null) {
      const viejo = historial[this.editIndex];
      nuevoRegistro = {
        ...datosForm,
        tarifaReferencial: viejo.tarifa,
        fechaIngresoReferencial: viejo.fechaIngresoActual,
        fechaIngresoActual: ahora
      };
      historial[this.editIndex] = nuevoRegistro;
      alert('Recorrido actualizado exitosamente');
    } else {
      nuevoRegistro = {
        ...datosForm,
        tarifaReferencial: datosForm.tarifa,
        fechaIngresoReferencial: ahora,
        fechaIngresoActual: ahora
      };
      historial.push(nuevoRegistro);
      alert('Recorrido registrado exitosamente');
    }

    localStorage.setItem('historialRecorridos', JSON.stringify(historial));
    this.router.navigate(['/historial-recorridos']);
  }

  removeParada(index: number) {
    const sel = this.recorridoForm.get('paradasSeleccionadas')!.value || [];
    sel.splice(index, 1);
    this.recorridoForm.patchValue({ paradasSeleccionadas: sel });
  }

  irAlHistorial() {
    this.router.navigate(['/historial-recorridos']);
  }
}