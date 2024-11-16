package com.prabal.spotify_clone.catalogcontext.application.mapper;

import com.prabal.spotify_clone.catalogcontext.application.dto.ReadSongInfoDTO;
import com.prabal.spotify_clone.catalogcontext.application.dto.SaveSongDTO;
import com.prabal.spotify_clone.catalogcontext.application.vo.SongAuthorVO;
import com.prabal.spotify_clone.catalogcontext.application.vo.SongTitleVO;
import com.prabal.spotify_clone.catalogcontext.domain.Song;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SongMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "publicId", ignore = true)
    Song saveSongDTOToSong(SaveSongDTO saveSongDTO);

    @Mapping(target = "isFavorite", ignore = true)
    ReadSongInfoDTO songToReadSongInfoDTO(Song song);

    default SongTitleVO stringToSongTitleVO(String title){
        return new SongTitleVO(title);
    }

    default SongAuthorVO stringToSongAuthorVO(String author){
        return new SongAuthorVO(author);
    }

    default String songTitleVOToString(SongTitleVO title){
        return title.value();
    }

    default String songAuthorVOToString(SongAuthorVO author){
        return author.value();
    }
}
