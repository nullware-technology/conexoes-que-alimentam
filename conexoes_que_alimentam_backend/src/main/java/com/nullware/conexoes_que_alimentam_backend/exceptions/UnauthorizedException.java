package com.nullware.conexoes_que_alimentam_backend.exceptions;

public class UnauthorizedException extends ApiException {

  public UnauthorizedException(String message) {
    super(message, 401);
  }

}
