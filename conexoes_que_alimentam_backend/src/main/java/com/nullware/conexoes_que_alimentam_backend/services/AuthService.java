package com.nullware.conexoes_que_alimentam_backend.services;

import com.nullware.conexoes_que_alimentam_backend.dtos.LoginDTO;
import com.nullware.conexoes_que_alimentam_backend.dtos.LoginResponseDTO;
import com.nullware.conexoes_que_alimentam_backend.dtos.UserRegisterDTO;
import com.nullware.conexoes_que_alimentam_backend.entities.Donee;
import com.nullware.conexoes_que_alimentam_backend.entities.Donor;
import com.nullware.conexoes_que_alimentam_backend.entities.User;
import com.nullware.conexoes_que_alimentam_backend.enums.UserRole;
import com.nullware.conexoes_que_alimentam_backend.exceptions.ConflictException;
import com.nullware.conexoes_que_alimentam_backend.exceptions.UnauthorizedException;
import com.nullware.conexoes_que_alimentam_backend.repositories.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepo userRepo;
  private final BCryptPasswordEncoder bcrypt;

  public void register(UserRegisterDTO userDTO) {
    if(this.userRepo.findByEmail(userDTO.email()).isPresent()) {
      throw new ConflictException("Email já cadastrado.");
    }

    User user;
    String password = bcrypt.encode(userDTO.password());
    if (userDTO.role().equals(UserRole.DONOR)) {
      user = new Donor(userDTO, password);
    } else {
      user = new Donee(userDTO, password);
    }

    this.userRepo.save(user);
  }

  public LoginResponseDTO login(LoginDTO loginDTO) {
    User user =  userRepo.findByEmail(loginDTO.email())
        .orElseThrow(() -> new UnauthorizedException("Email ou senha inválidos."));

    boolean isValid = bcrypt.matches(loginDTO.password(), user.getPassword());

    if(isValid) {
      // generate token
    } else {
      throw new UnauthorizedException("Email ou senha inválidos.");
    }

    return new LoginResponseDTO("");
  }

}
