import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../auth-service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  email?: string;
  password?: string;
  router = inject(Router);
  http = inject(HttpClient);
  accountService = inject(AccountService);
  subs = new Subscription();

  constructor() {
    this.loginForm = new FormGroup({
      'email': new FormControl(),
      'password': new FormControl()
    });
  }

  onLogin() {
    this.email = this.loginForm.get('email')?.value;
    this.password = this.loginForm.get('password')?.value;
    this.subs = this.accountService
      .logIn(this.email!, this.password!)
      .subscribe({
        next: (cb: any): any => {},
        error: (err) => {
          console.log(err);
          console.log('this is from error in subscribe');
        }
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
