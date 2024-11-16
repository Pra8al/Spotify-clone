package com.prabal.spotify_clone.catalogcontext.application.mapper;

import com.prabal.spotify_clone.catalogcontext.application.dto.SaveSongDTO;
import com.prabal.spotify_clone.catalogcontext.application.dto.SongContentDTO;
import com.prabal.spotify_clone.catalogcontext.domain.SongContent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SongContentMapper {

    @Mapping(source = "song.publicId", target = "publicId")
    SongContentDTO songContentToSongContentDTO(SongContent songContent);

    SongContent saveSongDTOToSong(SaveSongDTO songDTO);
}
