import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../../../services/storage.service';
import { UserService } from '../../../services/user.service';
import { ProfileComponent } from '../../nav-bar/profile/profile.component';

@Component({
  selector: 'navv',
  standalone: true,
  imports: [RouterModule, ProfileComponent],
  templateUrl: './navv.component.html',
  styleUrl: './navv.component.css'
})
export class NavvComponent implements OnInit{
  constructor(
    private router: Router,
    private storageService: StorageService,
    private userService: UserService
  ) {}
  authenticated = !this.storageService.getToken();
  settings = false;
  ngOnInit(): void {
    this.storageService.watchToken().subscribe((token) => {
      this.authenticated = !token;
    });
    if (!this.authenticated) this.userService.setUser();
  }
  @Input() open!: Boolean;
  @Output() openChange = new EventEmitter<Boolean>();
  toggleSideBar() {
    this.openChange.emit(!this.open);
  }

}
