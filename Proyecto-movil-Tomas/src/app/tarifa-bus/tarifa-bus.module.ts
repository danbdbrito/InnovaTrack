import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TarifaBusPageRoutingModule } from './tarifa-bus-routing.module';

import { TarifaBusPage } from './tarifa-bus.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TarifaBusPageRoutingModule
  ],
  declarations: [TarifaBusPage]
})
export class TarifaBusPageModule {}
