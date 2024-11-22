package com.prabal.spotify_clone.catalogcontext.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.prabal.spotify_clone.catalogcontext.application.SongService;
import com.prabal.spotify_clone.catalogcontext.application.dto.ReadSongInfoDTO;
import com.prabal.spotify_clone.catalogcontext.application.dto.SaveSongDTO;
import com.prabal.spotify_clone.catalogcontext.application.dto.SongContentDTO;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class SongResource {
    private final SongService songService;
    private final Validator validator;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SongResource(SongService songService, Validator validator) {
        this.songService = songService;
        this.validator = validator;
    }

    @PostMapping(value = "/songs", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReadSongInfoDTO> add(@RequestParam(name = "cover") MultipartFile cover,
                                               @RequestParam(name = "file") MultipartFile file,
                                               @RequestParam(name = "dto") String saveSongDTOString) throws IOException {
        SaveSongDTO saveSongDTO = objectMapper.readValue(saveSongDTOString, SaveSongDTO.class);
        saveSongDTO = new SaveSongDTO(saveSongDTO.title(), saveSongDTO.author(), cover.getBytes(), cover.getContentType(), file.getBytes(), file.getContentType());

        Set<ConstraintViolation<SaveSongDTO>> violations = validator.validate(saveSongDTO);
        if (!violations.isEmpty()) {
            String violationJoined = violations.stream().map(violation -> violation.getPropertyPath() + " " + violation.getMessage())
                    .collect(Collectors.joining());
            ProblemDetail validationIssue = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST,
                    "Validation errors for the fields: " + violationJoined);
            return ResponseEntity.of(validationIssue).build();
        } else {
            return ResponseEntity.ok(songService.create(saveSongDTO));
        }
    }

    @GetMapping(value = "/songs")
    public ResponseEntity<List<ReadSongInfoDTO>> getAll() {
        return ResponseEntity.ok(songService.getAll());
    }

    @GetMapping("/songs/get-content")
    public ResponseEntity<SongContentDTO> getOneByPublicId(@RequestParam UUID publicId) {
        Optional<SongContentDTO> songContentByPublicId = songService.getOneByPublicId(publicId);
        return songContentByPublicId.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "UUID Unknown")).build());
    }

    @GetMapping("/songs/search")
    public ResponseEntity<List<ReadSongInfoDTO>> search(@RequestParam String searchText) {
        return ResponseEntity.ok(songService.search(searchText));
    }
}
