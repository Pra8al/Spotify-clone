import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {ReadSong, SaveSong, SongContent} from './model/song.model';
import {State} from './model/state.model';
import {environment} from '../../environments/environment.development';
import {catchError, map, Observable, of} from 'rxjs';
import {ToastService} from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  http = inject(HttpClient);

  toastService = inject(ToastService);

  private add$: WritableSignal<State<SaveSong, HttpErrorResponse>> =
    signal(State.Builder<SaveSong, HttpErrorResponse>().forInit().build());

  addSig = computed(() => this.add$());

  private getAll$: WritableSignal<State<Array<ReadSong>, HttpErrorResponse>> =
    signal(State.Builder<Array<ReadSong>, HttpErrorResponse>().forInit().build());

  getAllSig = computed(() => this.getAll$());

  private addOrRemovalFavorite$: WritableSignal<State<ReadSong, HttpErrorResponse>> =
    signal(State.Builder<ReadSong, HttpErrorResponse>().forInit().build());

  addOrRemovalFavoriteSig = computed(() => this.addOrRemovalFavorite$());

  private fetchFavoriteSong$: WritableSignal<State<Array<ReadSong>, HttpErrorResponse>> =
    signal(State.Builder<Array<ReadSong>, HttpErrorResponse>().forInit().build());

  fetchFavoriteSongSig = computed(() => this.fetchFavoriteSong$());

  constructor() {
  }

  add(song: SaveSong): void {
    const formData = new FormData();
    formData.append('cover', song.cover!);
    formData.append('file', song.file!);
    const clone = structuredClone(song);
    clone.file = undefined;
    clone.cover = undefined;
    formData.append('dto', JSON.stringify(clone));
    this.http.post<SaveSong>(`${environment.API_URL}/api/songs`, formData)
      .subscribe({
        next: savedSong => this.add$.set(State.Builder<SaveSong, HttpErrorResponse>().forSuccess(savedSong).build()),
        error: (err: HttpErrorResponse) => this.add$.set(State.Builder<SaveSong, HttpErrorResponse>().forError(err).build()),
      })
  }

  reset(): void {
    this.add$.set(State.Builder<SaveSong, HttpErrorResponse>().forInit().build());
  }

  getAll(): void {
    this.http.get<Array<ReadSong>>(`${environment.API_URL}/api/songs`)
      .subscribe(
        {
          next: songs => this.getAll$.set(State.Builder<Array<ReadSong>, HttpErrorResponse>().forSuccess(songs).build()),
          error: err => this.getAll$.set(State.Builder<Array<ReadSong>, HttpErrorResponse>().forError(err).build())
        }
      )
  }

  search(searchText: string): Observable<State<Array<ReadSong>, HttpErrorResponse>> {
    const queryParams = new HttpParams().set('searchText', searchText);
    return this.http.get<Array<ReadSong>>(`${environment.API_URL}/api/songs/search`, {params: queryParams})
      .pipe(map(songs => State.Builder<Array<ReadSong>, HttpErrorResponse>().forSuccess(songs).build()),
        catchError(err => of(State.Builder<Array<ReadSong>, HttpErrorResponse>().forError(err).build())))
  }

  addOrRemoveFavorite(favorite: boolean, publicId: string): void {
    this.http.post<ReadSong>(`${environment.API_URL}/api/songs/like`, {favorite, publicId})
      .subscribe({
        next: updatedSong => {
          this.addOrRemovalFavorite$.set(State.Builder<SongContent, HttpErrorResponse>().forSuccess(updatedSong).build());
          if (updatedSong.favorite) {
            this.toastService.show('Song added to favorite', 'SUCCESS');
          } else {
            this.toastService.show('Song removed from favorite', 'SUCCESS');
          }
        },
        error: err => {
          this.addOrRemovalFavorite$.set(State.Builder<SongContent, HttpErrorResponse>().forError(err).build());
          this.toastService.show('Error while adding song to favorite', 'DANGER');
        }
      })
  }

  fetchFavorite(): void {
    this.http.get<Array<ReadSong>>(`${environment.API_URL}/api/songs/like`).subscribe({
      next: favoriteSongs => {
        this.fetchFavoriteSong$.set(State.Builder<Array<ReadSong>, HttpErrorResponse>().forSuccess(favoriteSongs).build());
      },
      error: err => this.fetchFavoriteSong$.set(State.Builder<Array<ReadSong>, HttpErrorResponse>().forError(err).build())
    })
  }
}
