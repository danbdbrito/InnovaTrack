import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialRecorridosPage } from './historial-recorridos.page';

describe('HistorialRecorridosPage', () => {
  let component: HistorialRecorridosPage;
  let fixture: ComponentFixture<HistorialRecorridosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialRecorridosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
