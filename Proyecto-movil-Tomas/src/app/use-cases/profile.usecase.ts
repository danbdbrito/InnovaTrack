import { Injectable } from '@angular/core';
import { StorageService } from 'src/app/storageS.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserProfileService } from 'src/app/user-profile.service';

@Injectable({
    providedIn: 'root',
  })
  export class ProfileUseCase {
    constructor(
        private storageService: StorageService,
        private ngFireAuth: AngularFireAuth,
        private userProfileService: UserProfileService
    ) {}
    
    // Método para cargar el perfil de usuario
    async loadUserProfile(): Promise<{ success: boolean; data?: any; message?: string }> {
        try {
        const userProfile = await this.userProfileService.getUserProfile();
        return { success: true, data: userProfile };
        } catch (error) {
        console.error('Error al cargar el perfil de usuario:', error);
        return { success: false, message: 'Error al cargar el perfil de usuario' };
        }
    }
    
    // Método para actualizar el perfil de usuario
    async updateUserProfile(displayName: string, email: string): Promise<{ success: boolean; message: string }> {
        try {
        const user = await this.ngFireAuth.currentUser;
        if (user && user.email === email) {
            const response = await this.userProfileService.updateUserProfile({ displayName });
            return { success: true, message: response.message || 'Perfil actualizado exitosamente' };
        } else {
            return { success: false, message: 'El correo ingresado no coincide con el correo de autenticación.' };
        }
        } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        return { success: false, message: 'Error al actualizar el perfil' };
        }
    }

    // Método para eliminar el perfil de usuario
    async deleteUserProfile(): Promise<{ success: boolean; message: string }> {
        try {
        const response = await this.userProfileService.deleteUserProfile();
        await this.storageService.clear();
        await this.ngFireAuth.signOut();
        return { success: true, message: response.message || 'Perfil eliminado exitosamente' };
        } catch (error) {
        console.error('Error al eliminar el perfil:', error);
        return { success: false, message: 'Error al eliminar el perfil' };
        }
    }

  }
  