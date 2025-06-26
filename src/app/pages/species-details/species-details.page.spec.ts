import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpeciesDetailsPage } from './species-details.page';

describe('SpeciesDetailsPage', () => {
  let component: SpeciesDetailsPage;
  let fixture: ComponentFixture<SpeciesDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeciesDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
