package com.nullware.conexoes_que_alimentam_backend.controllers;

import com.nullware.conexoes_que_alimentam_backend.dtos.LoginDTO;
import com.nullware.conexoes_que_alimentam_backend.dtos.LoginResponseDTO;
import com.nullware.conexoes_que_alimentam_backend.dtos.UserRegisterDTO;
import com.nullware.conexoes_que_alimentam_backend.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  @PostMapping("/register")
  public ResponseEntity<String> register(@RequestBody UserRegisterDTO userDTO) {
    authService.register(userDTO);

    return ResponseEntity.status(HttpStatus.CREATED).body("Usuário criado com sucesso.");
  }

  @PostMapping("/login")
  public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginDTO loginDTO) {
    LoginResponseDTO response = authService.login(loginDTO);

    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

}
