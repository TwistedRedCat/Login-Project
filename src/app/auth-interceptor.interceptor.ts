import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get the token from localStorage
    const token = localStorage.getItem('currentUser')!;
    console.log(token);
    // Clone the request and add the token to the headers if it exists
    if (token) {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      console.log('this is from interceptor');
      return next.handle(authReq);
    }
    console.log('this is from interceptor 2nd part');
    // If there's no token, just pass the original request
    return next.handle(req);
  }
}
