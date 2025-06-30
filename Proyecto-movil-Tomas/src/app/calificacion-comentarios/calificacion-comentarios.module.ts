import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalificacionComentariosPageRoutingModule } from './calificacion-comentarios-routing.module';

import { CalificacionComentariosPage } from './calificacion-comentarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalificacionComentariosPageRoutingModule
  ],
  declarations: [CalificacionComentariosPage]
})
export class CalificacionComentariosPageModule {}
