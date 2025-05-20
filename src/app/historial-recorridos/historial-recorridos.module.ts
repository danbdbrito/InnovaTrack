import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialRecorridosPageRoutingModule } from './historial-recorridos-routing.module';

import { HistorialRecorridosPage } from './historial-recorridos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialRecorridosPageRoutingModule
  ],
  declarations: [HistorialRecorridosPage]
})
export class HistorialRecorridosPageModule {}
