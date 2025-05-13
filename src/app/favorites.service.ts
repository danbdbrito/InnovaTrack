import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthenticaService } from './authentica.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favoritesCollection = 'favorites';

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthenticaService
  ) {}

  // Añadir un favorito
  async addFavorite(photo: string, commonName: string, scientificName: string, description: string, birdId: string) {
    const userId = await this.authService.getUserUID(); // Obtiene el UID del usuario
  
    if (userId) {
      const favorite = {
        userId: userId, // UID del usuario
        photo: photo,
        commonName: commonName,
        scientificName: scientificName,
        description: description,
        birdId: birdId // Agregar birdId al objeto
      };
  
      // Agregar el documento a la colección 'favorites'
      return this.firestore.collection('favorites').add(favorite)
        .then(() => console.log('Favorito añadido con éxito'))
        .catch((error) => console.error('Error al añadir favorito:', error));
    } else {
      console.error('Usuario no autenticado');
      throw new Error('Usuario no autenticado');
    }
  }

  // Obtener favoritos del usuario autenticado
  getFavorites(userId: string): Observable<any[]> {
    return this.firestore
      .collection(this.favoritesCollection, (ref) =>
        ref.where('userId', '==', userId)
      )
      .valueChanges({ idField: 'id' });
  }

  // Eliminar un favorito
  deleteFavorite(id: string): Promise<void> {
    return this.firestore
      .collection(this.favoritesCollection)
      .doc(id)
      .delete();
  }
}
