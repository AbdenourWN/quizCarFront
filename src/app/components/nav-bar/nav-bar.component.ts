import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  Event,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { StorageService } from '../../services/storage.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'nav-bar',
  standalone: true,
  imports: [RouterModule, ProfileComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit {
  constructor(
    private router: Router,
    private storageService: StorageService,
    private userService: UserService
  ) {}
  authenticated = !this.storageService.getToken();
  ngOnInit(): void {
    this.storageService.watchToken().subscribe((token) => {
      this.authenticated = !token;
    });
    if (!this.authenticated) this.userService.setUser();
  }
}
