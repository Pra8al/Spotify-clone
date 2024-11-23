package com.prabal.spotify_clone.catalogcontext.repository;

import com.prabal.spotify_clone.catalogcontext.domain.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SongRepository extends JpaRepository<Song, Long> {

    @Query("SELECT s FROM Song s WHERE lower(s.title) LIKE lower(concat('%',:searchText, '%')) or lower(s.author) LIKE lower(concat('%',:searchText, '%')) ")
    List<Song> findByTitleOrAuthorContaining(String searchText);

    Optional<Song> findOneByPublicId(UUID publicId);

    @Query("SELECT s FROM Song s JOIN Favorite f ON s.publicId = f.songPublicId WHERE f.userEmail = :email")
    List<Song> findAllFavoriteByUserEmail(String email);
}

