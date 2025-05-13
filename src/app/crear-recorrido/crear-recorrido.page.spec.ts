import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearRecorridoPage } from './crear-recorrido.page';

describe('CrearRecorridoPage', () => {
  let component: CrearRecorridoPage;
  let fixture: ComponentFixture<CrearRecorridoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearRecorridoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
