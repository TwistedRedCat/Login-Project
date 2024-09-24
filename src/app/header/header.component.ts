import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AccountService } from '../auth-service';

@Component({
  selector: 'app-header-component',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  loggedIn: boolean = false;
  user?: string | null;
  private accountService = inject(AccountService);

  ngOnInit(): void {
    this.accountService.isLoggedIn$.subscribe((data: any) => {
      if (data) {
        this.loggedIn = true;
        // this.user = data.email;
      } else {
        this.loggedIn = false;
      }
    });
    this.accountService.loggedEmail$.subscribe((data: any) => {
      if (data) {
        console.log(data);
        this.user = data;
      } else {
        this.user = null;
      }
    });
  }

  onLogout() {
    this.accountService.logOut();
  }
}
