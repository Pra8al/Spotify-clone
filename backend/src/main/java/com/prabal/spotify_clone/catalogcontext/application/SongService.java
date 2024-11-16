package com.prabal.spotify_clone.catalogcontext.application;

import com.prabal.spotify_clone.catalogcontext.application.dto.ReadSongInfoDTO;
import com.prabal.spotify_clone.catalogcontext.application.dto.SaveSongDTO;
import com.prabal.spotify_clone.catalogcontext.application.mapper.SongContentMapper;
import com.prabal.spotify_clone.catalogcontext.application.mapper.SongMapper;
import com.prabal.spotify_clone.catalogcontext.domain.Song;
import com.prabal.spotify_clone.catalogcontext.domain.SongContent;
import com.prabal.spotify_clone.catalogcontext.repository.SongContentRepository;
import com.prabal.spotify_clone.catalogcontext.repository.SongRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SongService {
    private final SongMapper songMapper;
    private final SongRepository songRepository;
    private final SongContentRepository songContentRepository;
    private final SongContentMapper songContentMapper;

    public SongService(SongMapper songMapper, SongRepository songRepository, SongContentRepository songContentRepository, SongContentMapper songContentMapper) {
        this.songMapper = songMapper;
        this.songRepository = songRepository;
        this.songContentRepository = songContentRepository;
        this.songContentMapper = songContentMapper;
    }

    public ReadSongInfoDTO create(SaveSongDTO saveSongDTO){
        Song song = songMapper.saveSongDTOToSong(saveSongDTO);
        Song songSaved = songRepository.save(song);

        SongContent songContent = songContentMapper.saveSongDTOToSong(saveSongDTO);
        songContent.setSong(songSaved);

        songContentRepository.save(songContent);

        return songMapper.songToReadSongInfoDTO(songSaved);

    }

    @Transactional(readOnly = true)
    public List<ReadSongInfoDTO> getAll(){
        return songRepository.findAll()
                .stream().map(songMapper::songToReadSongInfoDTO)
                .toList();
    }
}
