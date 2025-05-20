import { Injectable } from '@angular/core';
import { FirestoreStorageService } from './firestore-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private firestoreStorageService: FirestoreStorageService) {}

  async uploadImage(userId: string, base64Image: string): Promise<{ success: boolean; imageUrl: string }> {
    try {
      await this.firestoreStorageService.uploadImage(userId, base64Image);
      return { success: true, imageUrl: base64Image };
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      return { success: false, imageUrl: '' };
    }
  }
  
  async getImage(userId: string): Promise<string | null> {
    try {
      return await this.firestoreStorageService.getImage(userId);
    } catch (error) {
      console.error('Error al obtener la imagen:', error);
      return null;
    }
  }
  
}
