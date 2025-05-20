import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerHorariosPageRoutingModule } from './ver-horarios-routing.module';

import { VerHorariosPage } from './ver-horarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerHorariosPageRoutingModule
  ],
  declarations: [VerHorariosPage]
})
export class VerHorariosPageModule {}
