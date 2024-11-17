import {Component, effect, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {fontAwesomeIcons} from './shared/font-awesome-icons';
import {NavigationComponent} from './layout/navigation/navigation.component';
import {LibraryComponent} from './layout/library/library.component';
import {HeaderComponent} from './layout/header/header.component';
import {ToastService} from './service/toast.service';
import {NgbModal, NgbModalRef, NgbToast} from '@ng-bootstrap/ng-bootstrap';
import {PlayerComponent} from './layout/player/player.component';
import {AuthPopupState, AuthService} from './service/auth.service';
import {AuthPopupComponent} from './layout/auth-popup/auth-popup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FontAwesomeModule, NavigationComponent, LibraryComponent, HeaderComponent, NgbToast, PlayerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Spotify-clone';

  private faIconLibrary = inject(FaIconLibrary);
  toastService = inject(ToastService);

  private authService = inject(AuthService);
  private modalService = inject(NgbModal);
  private authModalRef: NgbModalRef | null = null;

  ngOnInit() {
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
    this.toastService.show("Hello Toast","SUCCESS");
  }

  private openOrCloseAuthModal(state: AuthPopupState): void {
    if(state === "OPEN"){
      this.openAuthPopup();
    }else if (this.authModalRef !=null && state === "CLOSE" && this.modalService.hasOpenModals()){
      this.authModalRef.close();
    }
  }

  private openAuthPopup() {
    this.authModalRef = this.modalService.open(AuthPopupComponent, {
      ariaLabelledBy: 'authentication-modal',
      centered: true
    });

    this.authModalRef.dismissed.subscribe({
      next: result => {this.authService.openOrCloseAuthPopup("CLOSE");
      }
    })
  }

  constructor() {
    effect(() => {
      this.openOrCloseAuthModal(this.authService.authPopupStateChange())
    }, {allowSignalWrites: true});
  }
}
