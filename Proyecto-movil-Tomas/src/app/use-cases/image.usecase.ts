import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ImageService } from 'src/app/image-service.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ToastController } from '@ionic/angular';
import { FirestoreStorageService } from 'src/app/firestore-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ImageUseCase {
  constructor(
    private ngFireAuth: AngularFireAuth,
    private imageService: ImageService,
    private toastController: ToastController,
    private firestoreStorageService: FirestoreStorageService
  ) {}

  // Cargar imagen de perfil
  async loadProfileImage(): Promise<{ success: boolean; data?: string; message?: string }> {
    try {
      const userId = (await this.ngFireAuth.currentUser)?.uid;
      if (userId) {
        const base64Data = await this.imageService.getImage(userId);
        if (base64Data) {
          return { success: true, data: `data:image/png;base64,${base64Data}` };
        } else {
          return { success: true, data: 'assets/Bird-icon.png' }; // Imagen predeterminada
        }
      }
      return { success: false, message: 'Usuario no autenticado.' };
    } catch (error) {
      console.error('Error al cargar la imagen:', error);
      return { success: false, message: 'Error al cargar la imagen de perfil.' };
    }
  }

  // Guardar imagen de perfil
  async saveProfileImage(base64Image: string): Promise<{ success: boolean; message: string }> {
    try {
      const userId = (await this.ngFireAuth.currentUser)?.uid;
      if (userId) {
        const result = await this.imageService.uploadImage(userId, base64Image);
        if (result.success) {
          return { success: true, message: 'Imagen actualizada correctamente.' };
        } else {
          return { success: false, message: 'Error al subir la imagen.' };
        }
      }
      return { success: false, message: 'Usuario no autenticado.' };
    } catch (error) {
      console.error('Error al guardar la imagen:', error);
      return { success: false, message: 'Error al guardar la imagen.' };
    }
  }

  // Actualizar imagen de perfil
  async updateProfileImage(source: CameraSource): Promise<{ success: boolean; message: string }> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Base64,
        source,
      });
      if (image.base64String) {
        return await this.saveProfileImage(image.base64String);
      }
      return { success: false, message: 'No se seleccionó ninguna imagen.' };
    } catch (error) {
      console.error('Error al actualizar la imagen:', error);
      return { success: false, message: 'Error al actualizar la imagen.' };
    }
  }

  // Eliminar imagen de perfil
  async removeProfileImage(): Promise<{ success: boolean; message: string }> {
    try {
      const userId = (await this.ngFireAuth.currentUser)?.uid;
      if (userId) {
        await this.firestoreStorageService.uploadImage(userId, ''); // Sobrescribe con vacío
        return { success: true, message: 'Imagen eliminada correctamente.' };
      }
      return { success: false, message: 'Usuario no autenticado.' };
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
      return { success: false, message: 'Error al eliminar la imagen.' };
    }
  }

  
}
