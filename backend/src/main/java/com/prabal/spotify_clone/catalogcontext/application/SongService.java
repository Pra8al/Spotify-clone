package com.prabal.spotify_clone.catalogcontext.application;

import com.prabal.spotify_clone.catalogcontext.application.dto.FavoriteSongDTO;
import com.prabal.spotify_clone.catalogcontext.application.dto.ReadSongInfoDTO;
import com.prabal.spotify_clone.catalogcontext.application.dto.SaveSongDTO;
import com.prabal.spotify_clone.catalogcontext.application.dto.SongContentDTO;
import com.prabal.spotify_clone.catalogcontext.application.mapper.SongContentMapper;
import com.prabal.spotify_clone.catalogcontext.application.mapper.SongMapper;
import com.prabal.spotify_clone.catalogcontext.domain.Favorite;
import com.prabal.spotify_clone.catalogcontext.domain.FavoriteId;
import com.prabal.spotify_clone.catalogcontext.domain.Song;
import com.prabal.spotify_clone.catalogcontext.domain.SongContent;
import com.prabal.spotify_clone.catalogcontext.repository.FavoriteRepository;
import com.prabal.spotify_clone.catalogcontext.repository.SongContentRepository;
import com.prabal.spotify_clone.catalogcontext.repository.SongRepository;
import com.prabal.spotify_clone.infrastructure.service.dto.State;
import com.prabal.spotify_clone.infrastructure.service.dto.StateBuilder;
import com.prabal.spotify_clone.usercontext.ReadUserDTO;
import com.prabal.spotify_clone.usercontext.application.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class SongService {
    private final SongMapper songMapper;
    private final SongRepository songRepository;
    private final SongContentRepository songContentRepository;
    private final SongContentMapper songContentMapper;
    private final UserService userService;
    private final FavoriteRepository favoriteRepository;

    public SongService(SongMapper songMapper, SongRepository songRepository, SongContentRepository songContentRepository, SongContentMapper songContentMapper, UserService userService, FavoriteRepository favoriteRepository) {
        this.songMapper = songMapper;
        this.songRepository = songRepository;
        this.songContentRepository = songContentRepository;
        this.songContentMapper = songContentMapper;
        this.userService = userService;
        this.favoriteRepository = favoriteRepository;
    }

    public ReadSongInfoDTO create(SaveSongDTO saveSongDTO) {
        Song song = songMapper.saveSongDTOToSong(saveSongDTO);
        Song songSaved = songRepository.save(song);

        SongContent songContent = songContentMapper.saveSongDTOToSong(saveSongDTO);
        songContent.setSong(songSaved);

        songContentRepository.save(songContent);

        return songMapper.songToReadSongInfoDTO(songSaved);

    }

    @Transactional(readOnly = true)
    public List<ReadSongInfoDTO> getAll() {
        List<ReadSongInfoDTO> allSongs = songRepository.findAll()
                .stream().map(songMapper::songToReadSongInfoDTO)
                .toList();

        if (userService.isAuthenticated()) {
            return fetchFavoriteStatusForSongs(allSongs);
        }

        return allSongs;
    }

    public Optional<SongContentDTO> getOneByPublicId(UUID uuid) {
        Optional<SongContent> songByPublicId = songContentRepository.findOneBySongPublicId(uuid);
        return songByPublicId.map(songContentMapper::songContentToSongContentDTO);
    }

    public List<ReadSongInfoDTO> search(String searchText) {
        List<ReadSongInfoDTO> searchedSongs = songRepository.findByTitleOrAuthorContaining(searchText).stream().map(songMapper::songToReadSongInfoDTO)
                .toList();
        if (userService.isAuthenticated()) {
            return fetchFavoriteStatusForSongs(searchedSongs);
        }
        return searchedSongs;
    }

    public State<FavoriteSongDTO, String> addOrRemoveFromFavorite(FavoriteSongDTO favoriteSongDTO, String email) {
        StateBuilder<FavoriteSongDTO, String> builder = State.builder();
        Optional<Song> songToLikeOpt = songRepository.findOneByPublicId(favoriteSongDTO.publicId());
        if (songToLikeOpt.isEmpty()) {
            return builder.forError("Song public id doesn't exist").build();
        }
        Song songToLike = songToLikeOpt.get();

        ReadUserDTO user = userService.getByEmail(email).orElseThrow();

        if (favoriteSongDTO.favorite()) {
            Favorite favorite = new Favorite();
            favorite.setSongPublicId(songToLike.getPublicId());
            favorite.setUserEmail(user.email());
            favoriteRepository.save(favorite);
        } else {
            FavoriteId favoriteId = new FavoriteId(songToLike.getPublicId(), user.email());
            favoriteRepository.deleteById(favoriteId);
            favoriteSongDTO = new FavoriteSongDTO(false, songToLike.getPublicId());
        }
        return builder.forSuccess(favoriteSongDTO).build();
    }

    public List<ReadSongInfoDTO> fetchFavoriteSongs(String email) {
        return songRepository.findAllFavoriteByUserEmail(email)
                .stream()
                .map(songMapper::songToReadSongInfoDTO)
                .toList();
    }

    private List<ReadSongInfoDTO> fetchFavoriteStatusForSongs(List<ReadSongInfoDTO> songs) {
        ReadUserDTO authenticatedUser = userService.getAuthenticatedUserFromSecurityContext();

        List<UUID> songPublicIds = songs.stream().map(ReadSongInfoDTO::getPublicId).toList();

        List<UUID> userFavoriteSongs = favoriteRepository.findAllByUserEmailAndSongPublicIdIn(authenticatedUser.email(), songPublicIds)
                .stream().map(Favorite::getSongPublicId).toList();

        return songs.stream().peek(song -> {
            if (userFavoriteSongs.contains((song.getPublicId()))) {
                song.setFavorite(true);
            }
        }).toList();
    }
}
