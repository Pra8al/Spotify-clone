export interface TitleVO {
  value?: string;
}

export interface AuthorV0 {
  value?: string;
}

export interface SongBase {
  publicId?: string;
  title?: TitleVO;
  author?: AuthorV0;
}

export interface SaveSong extends SongBase {
  file?: File;
  fileContentType?: string;
  cover?: File;
  coverContentType?: string;
}

export interface ReadSong extends SongBase {
  cover?: string;
  coverContentType?: string;
  favorite: boolean;
  displayPlay: boolean;
}

export interface SongContent extends ReadSong {
  file?: string;
  fileContentType?: string;
}
