package com.prabal.spotify_clone.catalogcontext.repository;

import com.prabal.spotify_clone.catalogcontext.domain.Favorite;
import com.prabal.spotify_clone.catalogcontext.domain.FavoriteId;
import com.prabal.spotify_clone.usercontext.ReadUserDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FavoriteRepository extends JpaRepository<Favorite, FavoriteId> {
    List<Favorite> findAllByUserEmailAndSongPublicIdIn(String email, List<UUID> songPublicIds);
}
