import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreStorageService {
  constructor(private firestore: AngularFirestore) {}

  // Método para guardar una imagen Base64 en Firestore
  async uploadImage(userId: string, base64Image: string): Promise<void> {
    try {
      const documentPath = `users/${userId}/profileData/image`; // Cambiado a un documento válido
      await this.firestore.doc(documentPath).set(
        {
          photoBase64: base64Image,
          updatedAt: new Date(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Error al guardar la imagen en Firestore:', error);
      throw error;
    }
  }

  // Método para recuperar la imagen Base64 desde Firestore
  async getImage(userId: string): Promise<string | null> {
    try {
      const documentPath = `users/${userId}/profileData/image`;
      const doc = await this.firestore.doc(documentPath).get().toPromise();
      if (doc.exists) {
        const data = doc.data() as { photoBase64?: string }; // Especificamos el tipo
        return data.photoBase64 || null;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al recuperar la imagen desde Firestore:', error);
      throw error;
    }
  }
  
}
