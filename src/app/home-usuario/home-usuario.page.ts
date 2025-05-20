import { Component, OnInit } from '@angular/core';
import { AuthenticaService } from '../authentica.service';
import { Router } from '@angular/router';
import { StorageService } from '../storageS.service';

@Component({
  selector: 'app-home-usuario',
  templateUrl: './home-usuario.page.html',
  styleUrls: ['./home-usuario.page.scss'],
})
export class HomeUsuarioPage implements OnInit {
  userName: string;
  horarioSeleccionado: any = null;

  constructor(
    public route: Router,
    public authService: AuthenticaService,
    private storageService: StorageService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.initUserName();
    this.cargarHorarioSeleccionado();
  }

  ionViewWillEnter(): void {
    this.cargarHorarioSeleccionado();
  }

  gocrearrecorrido() {
    this.route.navigate(['/crear-recorrido']);
  }

  private async initUserName(): Promise<void> {
    try {
      const storedUser = await this.storageService.get('user');
      if (storedUser) {
        this.setUserName(storedUser.displayName);
      } else {
        await this.fetchAndStoreUserProfile();
      }
    } catch (error) {
      console.error('Error initializing user name:', error);
      this.setUserName('Usuario');
    }
  }

  private async fetchAndStoreUserProfile(): Promise<void> {
    try {
      const user = await this.authService.getProfile();
      if (user) {
        this.setUserName(user.displayName);
        await this.storageService.set('user', {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
        });
      } else {
        this.setUserName('Usuario');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      this.setUserName('Usuario');
    }
  }

  private setUserName(displayName: string | undefined): void {
    this.userName = displayName || 'Usuario';
  }

  cargarHorarioSeleccionado() {
    const horarioJson = localStorage.getItem('horarioSeleccionadoObj');
    if (horarioJson) {
      this.horarioSeleccionado = JSON.parse(horarioJson);
    } else {
      this.horarioSeleccionado = null;
    }
  }
}
