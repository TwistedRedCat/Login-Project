import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
// import { AppComponent } from './app.component';
import { AuthenticateComponent } from './authenticate/authenticate.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'authenticate/:activePage', component: AuthenticateComponent },
  { path: '**', redirectTo: '' }
];
