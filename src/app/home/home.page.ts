import { Component, OnInit } from '@angular/core';
import { AuthenticaService } from '../authentica.service';
import { Router } from '@angular/router';
import { StorageService } from '../storageS.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  userName: string;

  constructor(
    public route: Router,
    public authService: AuthenticaService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.initUserName(); // Método síncrono que inicia el flujo
  }

  ionViewWillEnter(): void {
    this.initUserName(); // Reutilizamos la misma función para consistencia
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
      this.setUserName('Usuario'); // Valor predeterminado en caso de error
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
}


