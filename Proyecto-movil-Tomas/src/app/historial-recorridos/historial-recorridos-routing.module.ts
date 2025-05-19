import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialRecorridosPage } from './historial-recorridos.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialRecorridosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialRecorridosPageRoutingModule {}
