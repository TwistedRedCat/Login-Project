import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AccountService } from '../auth-service';
import { forkJoin, from, map, mergeMap, tap } from 'rxjs';
import { merge, mergeWith } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  loggedIn: boolean = false;
  user?: string | null;
  private accountService = inject(AccountService);
  // x: any = 60;
  // char = signal(this.x);
  // arr = [this.accountService.isLoggedIn$, this.accountService.loggedEmail$];
  // arr: any[] = [];

  ngOnInit(): void {
    const obsArr = [];
    const x = this.accountService.isLoggedIn.subscribe((data: any) => {
      if (data) {
        this.loggedIn = true;
        // this.user = data.email;
      } else {
        this.loggedIn = false;
      }
    });

    const y = this.accountService.loggedEmail.subscribe((data: any) => {
      if (data) {
        console.log(data);
        this.user = data;
      } else {
        this.user = null;
      }
    });

    // forkJoin([x, y]).subscribe((data) => {
    //   console.log(data);
    // });

    // console.log('before forkjoin');
    // this.accountService.isLoggedIn
    //   .pipe(
    //     mergeWith(this.accountService.loggedEmail),
    //     map((data: any) => {
    //       console.log('from map');
    //       this.arr.push(data);
    //       return data;
    //     })
    //   )
    //   .subscribe((data) => {
    //     console.log('data ' + data);
    //   });

    // console.log('after forkjoin');
  }

  onLogout() {
    this.accountService.logOut();
  }

  // countDown() {
  //   this.char.update((old: any) => {
  //     return setInterval(() => {
  //       this.x = old;
  //       console.log(--old);
  //     }, 1000);
  //   });
  // }
}
