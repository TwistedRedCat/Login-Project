import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
// import { ExternalLibrariesService } from '../script-service';

@Component({
  selector: 'app-authenticate',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './authenticate.component.html',
  styleUrl: './authenticate.component.css'
})
export class AuthenticateComponent implements OnInit, OnDestroy {
  http = inject(HttpClient);
  countDown!: Subscription;
  route = inject(ActivatedRoute);
  router = inject(Router);

  // private externalLibs = [
  //   'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;900&display=swap'
  // ];

  counter = 10;
  tick = 1000;

  ngOnInit() {
    // this.externalLibs.forEach((libSrc) =>
    //   ExternalLibrariesService.injectLib(libSrc)
    // );

    this.countDown = timer(0, this.tick).subscribe(() => {
      while (this.counter > 0) {
        return --this.counter;
      }
      return this.countDown.unsubscribe;
    });
  }

  ngOnDestroy() {
    this.countDown.unsubscribe;
  }

  onCode(code1: string, code2: string, code3: string, code4: string) {
    const code = code1 + code2 + code3 + code4;
    console.log(code);
    const firstParam: string | null =
      this.route.snapshot.queryParamMap.get('email');
    console.log(firstParam);
    this.http
      .post(`http://localhost:8080/authenticate`, {
        email: firstParam,
        code: code
      })
      .subscribe({
        next: (data) => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.router.navigate(['/err']);
          console.log(err);
        }
      });
  }
}
