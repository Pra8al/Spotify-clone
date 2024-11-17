import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {ReadSong, SongContent} from './model/song.model';
import {State} from './model/state.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SongContentService {

  http = inject(HttpClient);
  private queueToPlay$: WritableSignal<Array<ReadSong>> = signal([]);
  queueToPlay = computed(() => this.queueToPlay$());

  private play$: WritableSignal<State<SongContent, HttpErrorResponse>> =
    signal(State.Builder<SongContent, HttpErrorResponse>().forInit().build());
  playNewSong = computed(() => this.play$());

  createNewQueue(firstSong: ReadSong, songsToPlay: Array<ReadSong>): void {
    songsToPlay = songsToPlay.filter(song =>
      song.publicId !== firstSong.publicId
    );
    if (songsToPlay) {
      songsToPlay.unshift(firstSong);
    }
    this.queueToPlay$.set(songsToPlay);
  }

  fetchNextSong(songToPlay: SongContent): void {
    const queryParam = new HttpParams().set('publicId', songToPlay.publicId!);
    this.http.get<SongContent>(`${environment.API_URL}/api/songs/get-content`, {params: queryParam})
      .subscribe({
        next: song => {
          this.mapReadSongToSongContent(song, songToPlay);
          this.play$.set(State.Builder<SongContent, HttpErrorResponse>().forSuccess(song).build());
        },
        error: (err: HttpErrorResponse) => this.play$.set(State.Builder<SongContent, HttpErrorResponse>().forError(err).build()),
      })
  }

  private mapReadSongToSongContent(songContent: SongContent, songToPlay: ReadSong): void {
    songContent.cover = songToPlay.cover;
    songContent.coverContentType = songToPlay.coverContentType;
    songContent.title = songToPlay.title;
    songContent.author = songToPlay.author;
    songContent.favorite = songToPlay.favorite;
  }

  constructor() {
  }
}
