import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-recorrido',
  templateUrl: './crear-recorrido.page.html',
  styleUrls: ['./crear-recorrido.page.scss'],
})
export class CrearRecorridoPage implements OnInit {
  recorridoForm: FormGroup;
  buses = ['Bus 101', 'Bus 202', 'Bus 303'];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // Inicializamos el formulario con los controles necesarios
    this.recorridoForm = this.fb.group({
      bus: ['', Validators.required],
      ruta: ['', Validators.required],
      horaSalida: ['', Validators.required],

            gohistorialRecorridos() {
    this.route.navigate(['/historial-recorridos']);
    }
    }

    
  
  
  );
    
  }

  

  // Función para guardar el recorrido
  guardarRecorrido() {
    if (this.recorridoForm.valid) {
      const datos = this.recorridoForm.value;

      // Recuperamos el historial de recorridos desde localStorage
      const historialRecorridos = JSON.parse(localStorage.getItem('historialRecorridos') || '[]');

      // Agregamos el nuevo recorrido al historial
      historialRecorridos.push(datos);

      // Guardamos el historial actualizado en localStorage
      localStorage.setItem('historialRecorridos', JSON.stringify(historialRecorridos));

      console.log('Recorrido guardado:', datos);
      alert('Recorrido registrado exitosamente');

      // Limpiamos el formulario después de guardar
      this.recorridoForm.reset();
    }
    
  }
}
