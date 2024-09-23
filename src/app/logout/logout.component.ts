import { Component, inject } from '@angular/core';
import { AccountService } from '../auth-service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  accountService = inject(AccountService);
}
