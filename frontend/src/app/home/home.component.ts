import {Component, effect, inject, OnInit} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {SongCardComponent} from './song-card/song-card.component';
import {SongService} from '../service/song.service';
import {ToastService} from '../service/toast.service';
import {ReadSong} from '../service/model/song.model';
import {FormBuilder} from '@angular/forms';
import {SongContentService} from '../service/song-content.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FontAwesomeModule, SongCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private songService = inject(SongService);
  private toastService = inject(ToastService);
  private songContentService = inject(SongContentService);
  allSongs: Array<ReadSong> | undefined;

  constructor() {
    effect(() => {
      const allSigResponse = this.songService.getAllSig();
      if(allSigResponse.status === "OK") {
        this.allSongs = allSigResponse.value;
      }else if(allSigResponse.status === "ERROR") {
        this.toastService.show("Error occurred when getting all songs", "DANGER");
      }
    })
  }

  ngOnInit(): void {
    this.songService.getAll();
  }

  onPlaySong(songToPlayFirst: ReadSong) {
    this.songContentService.createNewQueue(songToPlayFirst, this.allSongs!);
  }
}
