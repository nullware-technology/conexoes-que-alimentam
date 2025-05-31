package com.nullware.conexoes_que_alimentam_backend.exceptions;

public class ConflictException extends ApiException {

  public ConflictException(String message) {
    super(message, 409);
  }

}
