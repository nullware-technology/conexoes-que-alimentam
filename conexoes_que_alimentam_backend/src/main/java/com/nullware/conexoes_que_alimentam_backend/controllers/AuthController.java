package com.nullware.conexoes_que_alimentam_backend.controllers;

import com.nullware.conexoes_que_alimentam_backend.dtos.UserRegisterDTO;
import com.nullware.conexoes_que_alimentam_backend.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  @PostMapping
  public ResponseEntity<Map<String, String>> register(@RequestBody UserRegisterDTO userDTO) {
    authService.register(userDTO);

    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

}
