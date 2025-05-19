package com.nullware.conexoes_que_alimentam_backend.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.UUID;

@Service
public class TokenService {

  public static final String ISSUER = "conexoes-que-alimentam-api";
  public static final String TIMEZONE = "America/Recife";
  public static final String TOKEN_CREATION_EXCEPTION = "Erro ao gerar o token.";

  @Value("${security.jwt.secret}")
  private String secret;

  public String generateToken(UUID userId) {
    try {
      Algorithm algorithm = Algorithm.HMAC256(secret);

      return JWT.create()
          .withIssuer(ISSUER)
          .withIssuedAt(ZonedDateTime.now(ZoneId.of(TIMEZONE)).toInstant())
          .withExpiresAt(ZonedDateTime.now(ZoneId.of(TIMEZONE)).plusMinutes(120).toInstant())
          .withSubject(userId.toString())
          .sign(algorithm);
    } catch (JWTCreationException exception){
      throw new JWTCreationException(TOKEN_CREATION_EXCEPTION, exception);
    }
  }

}
