import { Injectable } from '@angular/core';
import { AuthenticaService } from 'src/app/authentica.service';

@Injectable({
  providedIn: 'root',
})
export class SignUpUseCase {
  constructor(
    private authService: AuthenticaService
  ) {}

  async executeSignUp(email: string, password: string, fullname: string): Promise<{ success: boolean; message: string }> {
    try {
      // Intento de registro de usuario
      const user = await this.authService.registerUser(email, password, fullname);
      if (user) {
        return { success: true, message: 'Registro exitoso' };
      } else {
        return { success: false, message: 'Error al crear el usuario' };
      }
    } catch (error: any) {
      // Manejo de errores con mensajes específicos
      let errorMessage = 'Error en el registro';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este correo ya está registrado.';
      }
      return { success: false, message: errorMessage };
    }
  }
}
