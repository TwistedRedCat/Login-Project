import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public isRegistring = false;
  public email!: string;
  public obj!: Object;

  public isLoggedIn = new Subject<boolean>();
  // public isLoggedIn$ = this.isLoggedIn.asObservable();

  public loggedEmail = new Subject<string>();
  // public loggedEmail$ = this.loggedEmail.asObservable();

  public currentUser!: {
    token: string;
  };
  public token: string | undefined; //same as token? syntax

  private http = inject(HttpClient);
  private router = inject(Router);

  set Registring(data: any) {
    this.isRegistring = data;
  }

  logIn(email: string, password: string) {
    return this.http
      .post('http://localhost:8080/login', {
        email: email,
        password: password
      })
      .pipe(
        tap((data: any) => {
          this.router.navigate(['/']);
          this.isLoggedIn.next(true);
          this.loggedEmail.next(data.email);
          console.log(data.token);
          localStorage.setItem('currentUser', data.token);
          this.autoLogOut();
        }),
        catchError((error: any) => {
          this.router.navigate(['/err']);
          const err = null;
          if (error.status === 0) {
            return throwError(() => 'something wrong');
          } else {
            return throwError(() => error);
          }
        })
      );
  }

  autoLogin() {
    return this.http.get('http://localhost:8080/login').pipe(
      tap((data: any) => {
        this.isLoggedIn.next(true);
        this.loggedEmail.next(data.email);
        this.autoLogOut();
      })
    );
  }

  logOut() {
    this.isLoggedIn.next(false);
    localStorage.removeItem('currentUser');
  }

  autoLogOut() {
    const x = setInterval(() => {
      this.logOut();
      clearInterval(x);
    }, 10000);
  }
}
