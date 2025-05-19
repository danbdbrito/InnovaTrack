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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.recorridoForm = this.fb.group({
      bus: ['', Validators.required],
      ruta: ['', Validators.required],
      horaSalida: ['', Validators.required],
      paradasSeleccionadas: [[], Validators.required],  // <-- Agregamos paradas seleccionadas
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
        horaSalida: recorrido.horaSalida,
        paradasSeleccionadas: recorrido.paradasSeleccionadas || []
      });
      this.paradas = this.paradasPorRuta[recorrido.ruta] || [];
    }
  }

  guardarRecorrido() {
    if (this.recorridoForm.valid) {
      const datos = this.recorridoForm.value;
      const historialRecorridos = JSON.parse(localStorage.getItem('historialRecorridos') || '[]');

      if (this.editIndex !== null) {
        historialRecorridos[this.editIndex] = datos;
        alert('Recorrido actualizado exitosamente');
      } else {
        historialRecorridos.push(datos);
        alert('Recorrido registrado exitosamente');
      }

      localStorage.setItem('historialRecorridos', JSON.stringify(historialRecorridos));
      this.router.navigate(['/historial-recorridos']);
    }
  }

  irAlHistorial() {
    this.router.navigate(['/historial-recorridos']);
  }
}
