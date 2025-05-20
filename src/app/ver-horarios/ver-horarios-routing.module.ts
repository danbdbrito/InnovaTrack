import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerHorariosPage } from './ver-horarios.page';

const routes: Routes = [
  {
    path: '',
    component: VerHorariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerHorariosPageRoutingModule {}
