import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticaService {

  constructor(public ngFireAuth: AngularFireAuth) { }

  async getUserUID(): Promise<string | null> {
    const user = await this.ngFireAuth.currentUser;
    return user ? user.uid : null;
  }

  async registerUser (email:string, password:string, displayName: string) {
    const userCredential = await this.ngFireAuth.createUserWithEmailAndPassword(email, password);
    if (userCredential.user) {
      await userCredential.user.updateProfile({
        displayName: displayName
      });
      
    }
    return userCredential;
  }

  async loginUser (email:string, password:string) {
    return await this.ngFireAuth.signInWithEmailAndPassword(email, password)
  }

  async resetPassword(email:string) {
    return await this.ngFireAuth.sendPasswordResetEmail(email)
  }

  async signOut() {
    return await this.ngFireAuth.signOut()
  }

  async getProfile() {
    const user = await this.ngFireAuth.currentUser;
    if (user && !user.displayName) {
      console.warn('El displayName no está configurado en Firebase');
    }
    return user;
  }
}
