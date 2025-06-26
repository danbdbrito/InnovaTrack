import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpeciesDetailsPage } from './species-details.page';

const routes: Routes = [
  {
    path: '',
    component: SpeciesDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpeciesDetailsPageRoutingModule {}
