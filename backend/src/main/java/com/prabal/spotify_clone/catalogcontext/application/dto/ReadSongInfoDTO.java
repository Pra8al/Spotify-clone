package com.prabal.spotify_clone.catalogcontext.application.dto;

import com.prabal.spotify_clone.catalogcontext.application.vo.SongAuthorVO;
import com.prabal.spotify_clone.catalogcontext.application.vo.SongTitleVO;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ReadSongInfoDTO(SongTitleVO songTitleVO, SongAuthorVO songAuthorVO, @NotNull byte[] cover,
                              @NotNull String coverContentType, @NotNull boolean isFavorite, @NotNull UUID publicId) {
}
