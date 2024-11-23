import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-favorite-song-card',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './favorite-song-card.component.html',
  styleUrl: './favorite-song-card.component.scss'
})
export class FavoriteSongCardComponent {

}
