import { Component, OnInit } from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  Router,
  ActivatedRoute,
  NavigationEnd,
  Event
} from '@angular/router';
import { filter, pairwise, map } from 'rxjs/operators';

import { HeaderComponent } from './header-component/header.component';

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

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const test = this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((e) => e as NavigationEnd)
      )
      .subscribe((e) => {
        this.page = e.url;
      });
  }
}
