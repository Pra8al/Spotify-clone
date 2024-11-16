package com.prabal.spotify_clone.catalogcontext.application.dto;

import com.prabal.spotify_clone.catalogcontext.application.vo.SongAuthorVO;
import com.prabal.spotify_clone.catalogcontext.application.vo.SongTitleVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import javax.xml.transform.Source;

public record SaveSongDTO(@Valid SongTitleVO title,
                          @Valid SongAuthorVO author,
                          @NotNull byte[] cover,
                          @NotNull String coverContentType,
                          @NotNull byte[] file,
                          @NotNull String fileContentType) {
}
