import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerHorariosPage } from './ver-horarios.page';

describe('VerHorariosPage', () => {
  let component: VerHorariosPage;
  let fixture: ComponentFixture<VerHorariosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerHorariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
