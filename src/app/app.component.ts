import { Component, inject, OnInit } from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  Router,
  ActivatedRoute
} from '@angular/router';

import { HeaderComponent } from './header-component/header.component';
import { AccountService } from './auth-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'front-end-angular-restAPI';
  page: string = '';

  public authService = inject(AccountService);

  constructor() {}

  ngOnInit(): void {
    this.authService.autoLogin().subscribe((data) => {
      console.log(data);
    });
  }
}
