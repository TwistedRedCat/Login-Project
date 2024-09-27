import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-authenticate',
  standalone: true,
  templateUrl: './authenticate.component.html',
  styleUrl: './authenticate.component.css'
})
export class AuthenticateComponent implements OnInit, OnDestroy {
  http = inject(HttpClient);
  countDown!: Subscription;
  route = inject(ActivatedRoute);
  router = inject(Router);
  konter = signal<any>(60);

  // konterDown() {
  //   setInterval(() => {
  //     this.konter--;
  //   },1000);
  // }

  // private externalLibs = [
  //   'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;900&display=swap'
  // ];

  counter = 60;
  tick = 1000;

  ngOnInit() {
    // this.countDown = timer(500, this.tick).subscribe(
    //   (): number | void => {
    //     while (this.counter > 0) {
    //       return --this.counter;
    //     }
    //     // return this.countDown.unsubscribe;
    //     console.log(this.countDown);
    //     return this.countDown.unsubscribe();
    //   }
    // );

    const intervalTracker = setInterval(() => {
      while (this.counter > 0) {
        return --this.counter;
      }
      return clearInterval(intervalTracker);
    }, this.tick);
  }

  ngOnDestroy() {
    this.countDown.unsubscribe();
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
