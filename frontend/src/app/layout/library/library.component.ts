import {Component, effect, inject, OnInit} from '@angular/core';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {RouterLink, RouterModule} from '@angular/router';
import {SmallSongCardComponent} from '../../shared/small-song-card/small-song-card.component';
import {SongService} from '../../service/song.service';
import {ReadSong} from '../../service/model/song.model';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
    FaIconComponent,
    RouterModule, SmallSongCardComponent
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent implements OnInit {

  private songService = inject(SongService);

  songs: Array<ReadSong> = [];

  constructor() {
    effect(() => {
      if(this.songService.getAllSig().status==="OK") {
        this.songs  = this.songService.getAllSig().value!;
      }
    })
  }

    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }

}
