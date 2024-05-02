import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'loading',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {
  token: any = null;
  constructor(private storage: StorageService) {
    this.token = storage.getToken();
  }

}
