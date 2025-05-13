import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { StorageService } from '../storageS.service';

@Injectable({
  providedIn: 'root',
})
export class UserUpdateUseCase {
  constructor(
    private firestore: AngularFirestore,
    private storageService: StorageService
  ) {}

  async performUserUpdate(newName: string): Promise<{ success: boolean; message: string }> {
    try {
      const currentUser = await this.storageService.get('user');
      if (!currentUser) {
        return { success: false, message: 'No hay usuario guardado' };
      }
  
      const uid = currentUser.uid;
  
      if (newName.trim()) {
        await this.firestore.collection('users').doc(uid).update({
          displayName: newName,
          updatedAt: new Date(),
        });
  
        const updatedUserData = {
          ...currentUser,
          displayName: newName,
        };
        await this.storageService.set('user', updatedUserData);
  
        return { success: true, message: 'Usuario actualizado con éxito' };
      } else {
        return { success: false, message: 'El nombre no puede estar vacío' };
      }
    } catch (error: any) {
      return { success: false, message: `Error actualizando usuario: ${error.message}` };
    }
  }
}
