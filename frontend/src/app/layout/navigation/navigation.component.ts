import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {FaIconComponent, FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    FaIconComponent,
    FontAwesomeModule
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {

}
