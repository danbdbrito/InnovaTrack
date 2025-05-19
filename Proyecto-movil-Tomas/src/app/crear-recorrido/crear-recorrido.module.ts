import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // 👈 Aquí

import { IonicModule } from '@ionic/angular';

import { CrearRecorridoPageRoutingModule } from './crear-recorrido-routing.module';

import { CrearRecorridoPage } from './crear-recorrido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    IonicModule,
    CrearRecorridoPageRoutingModule
  ],
  declarations: [CrearRecorridoPage]
})
export class CrearRecorridoPageModule {}
