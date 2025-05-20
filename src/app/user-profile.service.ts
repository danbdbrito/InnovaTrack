import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { updateProfile } from '@firebase/auth';
import { update } from '@firebase/database';
import { firstValueFrom } from 'rxjs';
import { StorageService } from './storageS.service';


@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private ngFireAuth:AngularFireAuth, private db: AngularFireDatabase, private storageService: StorageService ) {}

  async createUserProfile(uid: string, email: string, displayName: string) {
    try {
      // Crear un nuevo perfil en Firestore bajo la colección /users/{uid}
      const userProfileRef = this.db.object(`/users/${uid}`);
      await userProfileRef.set({
        email,
        displayName,
        photoURL: '', // Puedes dejarlo vacío o agregar una imagen predeterminada
      });

      // También podemos almacenar el perfil en el almacenamiento local si es necesario
      const userProfile = {
        uid,
        email,
        displayName,
        photoURL: '',
      };
      await this.storageService.set('user', userProfile);

      return { success: true, message: 'Perfil creado en Firestore' };
    } catch (error) {
      throw new Error('Error al crear el perfil en Firestore: ' + error.message);
    }
  }

  async getUserProfile(){
    const user = await firstValueFrom(this.ngFireAuth.authState)
    if(user) {
      const userProfileRef = this.db.object(`/users/${user.uid}`).valueChanges()
      return firstValueFrom(userProfileRef)
    } else {
      throw new Error('Usuario no autenticado')
    }
  }

  async updateUserProfile(updateData: any) {
    const user = await firstValueFrom(this.ngFireAuth.authState)
    if (user) {
      await this.db.object(`/users/${user.uid}`).update(updateData)

      if(updateData.displayName){
        await updateProfile(user,{ displayName: updateData.displayName})
      }

      const updatedProfile = {
        ...updateData,
        uid: user.uid,
        email: user.email
      }

      await this.storageService.set('user', updatedProfile)

      return { sucess: true, message: 'Perfil actualizado con éxito'}
    } else {
      throw new Error('Usuario no autenticado')
    }
  }

  async deleteUserProfile() {
    const user = await firstValueFrom(this.ngFireAuth.authState)
    if (user) {
      await this.db.object(`/users/${user.uid}`).remove()
      await user.delete()
      return { sucess: true, message: 'Usuario eliminado con éxito'}
    } else {
      throw new Error('Usuario no autenticado')
    }
  }
}
 