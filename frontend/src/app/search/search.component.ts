import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {SmallSongCardComponent} from '../shared/small-song-card/small-song-card.component';
import {SongService} from '../service/song.service';
import {SongContentService} from '../service/song-content.service';
import {ToastService} from '../service/toast.service';
import {ReadSong} from '../service/model/song.model';
import {debounce, filter, interval, of, switchMap, tap} from 'rxjs';
import {State} from '../service/model/state.model';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    FormsModule,
    FontAwesomeModule,
    SmallSongCardComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  searchText = '';
  private songService = inject(SongService);
  private songContentService = inject(SongContentService);
  private toastService = inject(ToastService);

  songResult: Array<ReadSong> = [];

  isSearching = false;

  private resetResultIfEmptyTerm(newSearchTerm: string) {
    if (newSearchTerm.length === 0) {
      this.songResult = [];
    }
  }

  onSearch(newSearchTerm: string) {
    this.searchText = newSearchTerm;
    of(newSearchTerm).pipe(
      tap(newSearchTerm => this.resetResultIfEmptyTerm(newSearchTerm)),
      filter(newSearchTerm => newSearchTerm.length > 0),
      debounce(()=>interval(2000)),
      tap(() => this.isSearching = true),
      switchMap(searchTerm => this.songService.search(searchTerm))
    ).subscribe({
      next: searchState => this.onNext(searchState),
    });
  }

  onPlay(firstSong: ReadSong) {
    this.songContentService.createNewQueue(firstSong, this.songResult);
  }

  private onNext(searchState: State<Array<ReadSong>, HttpErrorResponse>) {
    this.isSearching = false;
    if(searchState.status === "OK") {
      this.songResult = searchState.value!;
    } else if (searchState.status === "ERROR") {
      this.toastService.show('An error occurred while searching', "DANGER");
    }
  }
}
