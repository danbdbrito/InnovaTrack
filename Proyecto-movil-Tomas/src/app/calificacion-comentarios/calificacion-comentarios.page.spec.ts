import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalificacionComentariosPage } from './calificacion-comentarios.page';

describe('CalificacionComentariosPage', () => {
  let component: CalificacionComentariosPage;
  let fixture: ComponentFixture<CalificacionComentariosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CalificacionComentariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
