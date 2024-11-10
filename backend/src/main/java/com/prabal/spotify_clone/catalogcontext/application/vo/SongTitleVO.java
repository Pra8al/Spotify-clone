package com.prabal.spotify_clone.catalogcontext.application.vo;

import jakarta.validation.constraints.NotBlank;

public record SongTitleVO(@NotBlank String value) {
}
