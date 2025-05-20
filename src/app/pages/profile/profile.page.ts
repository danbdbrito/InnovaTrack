import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { UserProfileService } from 'src/app/user-profile.service';
import { StorageService } from 'src/app/storageS.service';
import { ProfileUseCase } from 'src/app/use-cases/profile.usecase';
import { ImageService } from 'src/app/image-service.service';
import { FirestoreStorageService } from 'src/app/firestore-storage.service';
import { ImageUseCase } from 'src/app/use-cases/image.usecase';
import { AuthenticaService } from '../../authentica.service';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  userProfile: any;
  profileImage: string | null = null;

  constructor(
    public authService:AuthenticaService,
    private formBuilder: FormBuilder,
    private userProfileService: UserProfileService,
    private router: Router,
    private storageService: StorageService,
    private ngFireAuth: AngularFireAuth,
    private toastController: ToastController,
    private profileUseCase: ProfileUseCase,
    private actionSheetController: ActionSheetController,
    private imageService: ImageService,
    private firestoreStorageService: FirestoreStorageService,
    private imageUseCase: ImageUseCase
  ) {}

  // Lifecycle hooks
  async ngOnInit() {
    this.initializeForm();
    await this.loadUserProfile();
    await this.loadProfileImage();
  }

  /**
   * Initialize profile form
   */
  private initializeForm() {
    this.profileForm = this.formBuilder.group({
      displayName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // -----------------------
  // User profile methods
  // -----------------------

  /**
   * Load user profile data from use case
   */
  async loadUserProfile() {
    const result = await this.profileUseCase.loadUserProfile();
    if (result.success && result.data) {
      this.userProfile = result.data;
      this.profileForm.patchValue(this.userProfile);
    } else {
      this.presentToast(result.message || 'Error al cargar el perfil de usuario.');
    }
  }

  /**
   * Update user profile data
   */
  async updateUserProfile() {
    const { displayName, email } = this.profileForm.value;
    const result = await this.profileUseCase.updateUserProfile(displayName, email);
    this.presentToast(result.message);
  }

  /**
   * Delete user profile
   */
  async deleteUserProfile() {
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible.')) {
      const result = await this.profileUseCase.deleteUserProfile();
      this.presentToast(result.message);
      if (result.success) {
        this.router.navigate(['/landing']);
      }
    }
  }

  // -----------------------
  // Profile image methods
  // -----------------------

  /**
   * Load profile image
   */
  async loadProfileImage() {
    const result = await this.imageUseCase.loadProfileImage();
    if (result.success) {
      this.profileImage = result.data;
    } else {
      this.presentToast(result.message || 'Error al cargar la imagen.');
    }
  }

  /**
   * Open action sheet for profile image options
   */
  async updateProfileImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccionar opción',
      buttons: [
        {
          text: 'Tomar Foto',
          icon: 'camera',
          handler: async () => await this.handleImageSelection(CameraSource.Camera),
        },
        {
          text: 'Seleccionar de Galería',
          icon: 'images',
          handler: async () => await this.handleImageSelection(CameraSource.Photos),
        },
        {
          text: 'Eliminar Imagen',
          icon: 'trash',
          role: 'destructive',
          handler: async () => await this.removeProfileImage(),
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  /**
   * Handle image selection
   */
  private async handleImageSelection(source: CameraSource) {
    try {
      const result = await this.imageUseCase.updateProfileImage(source);
      this.presentToast(result.message);
      if (result.success) {
        await this.loadProfileImage();
      }
    } catch (error) {
      console.error('Error al manejar la imagen:', error);
    }
  }

  /**
   * Remove profile image
   */
  async removeProfileImage() {
    const result = await this.imageUseCase.removeProfileImage();
    this.presentToast(result.message);
    if (result.success) {
      this.profileImage = 'assets/Bird-icon.png'; // Default image
    }
  }

  // -----------------------
  // Utility methods
  // -----------------------

  /**
   * Show a toast message
   */
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
  async logout(){
    await this.authService.signOut()
    await this.storageService.remove('isSessionActive');
    await this.storageService.clear()
    
    this.router.navigate(['/login'])
  }
}
