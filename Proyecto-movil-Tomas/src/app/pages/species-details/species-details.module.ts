import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpeciesDetailsPageRoutingModule } from './species-details-routing.module';

import { SpeciesDetailsPage } from './species-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpeciesDetailsPageRoutingModule
  ],
  declarations: [SpeciesDetailsPage]
})
export class SpeciesDetailsPageModule {}
