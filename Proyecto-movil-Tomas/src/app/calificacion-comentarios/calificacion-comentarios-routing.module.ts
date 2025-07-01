import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalificacionComentariosPage } from './calificacion-comentarios.page';

const routes: Routes = [
  {
    path: '',
    component: CalificacionComentariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalificacionComentariosPageRoutingModule {}
