import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthenticaService } from 'src/app/authentica.service';
import { ToastController } from '@ionic/angular';
import { StorageService } from 'src/app/storageS.service';
import { UserLoginUseCase } from 'src/app/use-cases/userlogin.usecase';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  constructor(private userLoginCase: UserLoginUseCase, public route : Router, public formBuilder:FormBuilder, public loadingCtrl: LoadingController, public authService:AuthenticaService, public toastController:ToastController, private storageService: StorageService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email :['', [
        Validators.required,
        Validators.email,
        Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"),
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern("(?=.*\d)(?=.*[a-z])(?=.*[0-8])(?=.*[A-Z]).{8,}")
      ]]

    })
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duración en milisegundos
      position: 'top'
    });
    toast.present();
  }
  

  get errorControl(){
    return this.loginForm?.controls;
  }

  async login() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    if (this.loginForm?.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      // Usa el caso de uso para realizar el inicio de sesión
      const result = await this.userLoginCase.login(email, password);

      // Cierra el loading spinner
      loading.dismiss();

      // Verifica el resultado y actúa en consecuencia
      if (result.success) {
        this.presentToast('Inicio de sesión exitoso');
        this.route.navigate(['/landing']);
      } else {
        this.presentToast(result.message);
      }
    } else {
      loading.dismiss();
      this.presentToast('Formulario inválido, Por favor, llene los campos correctamente.');
    }
  }
}