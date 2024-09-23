import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
// import { AppComponent } from './app.component';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { AuthGuard } from './auth-guard.guard';
import { LogoutComponent } from './logout/logout.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ErrComponent } from './err/err.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'err', component: ErrComponent },
  {
    path: 'authenticate',
    component: AuthenticateComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'err' }
];
