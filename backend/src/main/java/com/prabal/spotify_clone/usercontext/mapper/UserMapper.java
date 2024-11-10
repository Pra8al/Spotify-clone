package com.prabal.spotify_clone.usercontext.mapper;

import com.prabal.spotify_clone.usercontext.ReadUserDTO;
import com.prabal.spotify_clone.usercontext.domain.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    ReadUserDTO readUserDTOToUser(User entity);

}
