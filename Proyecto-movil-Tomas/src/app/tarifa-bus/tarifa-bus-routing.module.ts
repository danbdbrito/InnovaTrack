import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TarifaBusPage } from './tarifa-bus.page';

const routes: Routes = [
  {
    path: '',
    component: TarifaBusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TarifaBusPageRoutingModule {}
