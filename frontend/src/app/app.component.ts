import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {fontAwesomeIcons} from './shared/font-awesome-icons';
import {NavigationComponent} from './layout/navigation/navigation.component';
import {LibraryComponent} from './layout/library/library.component';
import {HeaderComponent} from './layout/header/header.component';
import {ToastService} from './service/toast.service';
import {NgbToast} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FontAwesomeModule, NavigationComponent, LibraryComponent, HeaderComponent, NgbToast],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Spotify-clone';

  private faIconLibrary = inject(FaIconLibrary);
  toastService = inject(ToastService);

  ngOnInit() {
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
    this.toastService.show("Hello Toast","SUCCESS");
  }
}
