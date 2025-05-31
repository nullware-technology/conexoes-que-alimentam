package com.nullware.conexoes_que_alimentam_backend.exceptions;

public class ApiException extends RuntimeException {

  private final int statusCode;

  protected ApiException(String message, int statusCode) {
    super(message);
    this.statusCode = statusCode;
  }

  public int getStatusCode() {
    return statusCode;
  }

}
