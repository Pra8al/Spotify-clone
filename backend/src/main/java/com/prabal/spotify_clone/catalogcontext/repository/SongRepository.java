package com.prabal.spotify_clone.catalogcontext.repository;

import com.prabal.spotify_clone.catalogcontext.domain.Song;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SongRepository extends JpaRepository<Song, Long> {

}
