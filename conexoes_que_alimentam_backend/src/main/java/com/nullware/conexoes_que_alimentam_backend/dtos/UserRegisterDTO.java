package com.nullware.conexoes_que_alimentam_backend.dtos;

import com.nullware.conexoes_que_alimentam_backend.entities.Address;
import com.nullware.conexoes_que_alimentam_backend.enums.UserRole;

public record UserRegisterDTO(
    String name, String email, String password, String phone, Address address, UserRole role) {}
