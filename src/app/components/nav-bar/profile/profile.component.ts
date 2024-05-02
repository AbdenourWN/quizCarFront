import { Component, Input, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../../../services/storage.service';
import { UserService } from '../../../services/user.service';
@Component({
  selector: 'profile',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  constructor(
    private router: Router,
    private storageService: StorageService,
    private userService: UserService
  ) {}
  user!: any;
  ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
  }
  logout() {
    this.storageService.removeToken();
    this.userService.removeUser();
    this.router.navigateByUrl('/');
  }
}
