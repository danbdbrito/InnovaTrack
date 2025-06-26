import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TarifaBusPage } from './tarifa-bus.page';

describe('TarifaBusPage', () => {
  let component: TarifaBusPage;
  let fixture: ComponentFixture<TarifaBusPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TarifaBusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
