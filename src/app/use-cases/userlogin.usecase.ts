import { Injectable } from '@angular/core';
import { AuthenticaService } from 'src/app/authentica.service';
import { StorageService } from 'src/app/storageS.service';


@Injectable({
  providedIn: 'root',
})
export class UserLoginUseCase {
    constructor(
      private authService: AuthenticaService,
      private storageService: StorageService
    ) {}
  
    async login(email: string, password: string): Promise<{ success: boolean; message: string }> {
        try {
          const userCredential = await this.authService.loginUser(email, password);
          const user = userCredential?.user;
    
          if (user) {
            // Clonar datos de usuario y guardarlos en el storage
            const userClone = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || 'Usuario',
            };
            await this.storageService.set('user', userClone);
            await this.storageService.set('isSessionActive', true);
            return { success: true, message: "Inicio de sesión exitoso" };
          } else {
            return { success: false, message: "Credenciales incorrectas" };
          }
        } catch (error) {
          let errorMessage = "Correo o Contraseña incorrectos";
          if (error.code === 'auth/wrong-password') errorMessage = "Contraseña incorrecta.";
          return { success: false, message: errorMessage };
        }
      }
      
  }
  
