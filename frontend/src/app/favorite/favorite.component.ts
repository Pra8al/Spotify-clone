import {Component, effect, inject, OnInit} from '@angular/core';
import {FavoriteSongBtnComponent} from '../shared/favorite-song-btn/favorite-song-btn.component';
import {SmallSongCardComponent} from '../shared/small-song-card/small-song-card.component';
import {ReadSong} from '../service/model/song.model';
import {SongService} from '../service/song.service';
import {SongContentService} from '../service/song-content.service';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [
    FavoriteSongBtnComponent,
    SmallSongCardComponent],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit {
  favoritesSongs: Array<ReadSong> = [];
  songService = inject(SongService);
  songContentService = inject(SongContentService);

  constructor() {
    effect(() => {
      const addOrRemoveFavoriteSongSig = this.songService.addOrRemovalFavoriteSig();
      if (addOrRemoveFavoriteSongSig.status === "OK") {
        this.songService.fetchFavorite();
      }
    });

    effect(() => {
      const favoriteSongState = this.songService.fetchFavoriteSongSig();
      if (favoriteSongState.status === "OK") {
        favoriteSongState.value?.forEach(song => song.favorite = true);
        this.favoritesSongs = favoriteSongState.value!;
      }
    });
  }

  ngOnInit(): void {
    this.songService.fetchFavorite();
  }

  onPlay(firstSong: ReadSong): void {
    this.songContentService.createNewQueue(firstSong, this.favoritesSongs);
  }


}
