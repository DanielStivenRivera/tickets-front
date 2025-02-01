import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {LoadingService} from './shared/services/loading.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatProgressSpinner,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(
    public readonly loadingService: LoadingService,
  ) {
  }

}
