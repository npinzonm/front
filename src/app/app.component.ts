import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [HeaderComponent, RouterOutlet],

})
export class AppComponent {
  title = 'Seguros_Confianza';
}
