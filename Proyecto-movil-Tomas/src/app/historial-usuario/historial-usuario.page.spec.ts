import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialUsuarioPage } from './historial-usuario.page';

describe('HistorialUsuarioPage', () => {
  let component: HistorialUsuarioPage;
  let fixture: ComponentFixture<HistorialUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
