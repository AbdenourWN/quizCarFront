import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { NavvComponent } from './navv/navv.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [NavvComponent, MatSidenavModule, SidebarComponent, RouterOutlet],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  user: any;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private userService: UserService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 740px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit(): void {
    this.userService.getUser().subscribe(
      (res) => (this.user = res),
      (err) => console.log(err)
    );
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  open = true;
  toggleSideBar() {
    this.open = !this.open;
  }
}
