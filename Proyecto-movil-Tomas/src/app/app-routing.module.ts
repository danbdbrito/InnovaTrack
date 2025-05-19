import { NgModule } from '@angular/core'; 
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: 'crear-recorrido',
    loadChildren: () => import('./crear-recorrido/crear-recorrido.module').then(m => m.CrearRecorridoPageModule)
  },
  
  {
    path: 'historial-recorridos', 
    loadChildren: () => import('./historial-recorridos/historial-recorridos.module').then(m => m.HistorialRecorridosPageModule)
  },
  
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
  { 
    path: 'catalogo', 
    loadChildren: () => import('./pages/catalogo/catalogo.module').then(m => m.CatalogoPageModule) 
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
  },
  { 
    path: 'species-details/:id', 
    loadChildren: () => import('./pages/species-details/species-details.module').then(m => m.SpeciesDetailsPageModule) 
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
