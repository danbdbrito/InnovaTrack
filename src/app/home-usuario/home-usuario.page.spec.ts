import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeUsuarioPage } from './home-usuario.page';
import { IonicModule } from '@ionic/angular';
describe('HomeUsuarioPage', () => {
  let component: HomeUsuarioPage;
  let fixture: ComponentFixture<HomeUsuarioPage>;

   beforeEach(async () => {
     await TestBed.configureTestingModule({
       declarations: [HomeUsuarioPage],
       imports: [IonicModule.forRoot()]
     }).compileComponents();
 
     fixture = TestBed.createComponent(HomeUsuarioPage);
     component = fixture.componentInstance;
     fixture.detectChanges();
   });
 

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
