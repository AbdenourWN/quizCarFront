import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { LandingPageComponent } from '../landing-page/landing-page.component';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, LandingPageComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
