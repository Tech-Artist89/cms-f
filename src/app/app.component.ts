import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './shared/navigation/navigation.component';
import { ThemeService } from './shared/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'CMS Mitra';

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // Theme service wird automatisch initialisiert
  }
}
