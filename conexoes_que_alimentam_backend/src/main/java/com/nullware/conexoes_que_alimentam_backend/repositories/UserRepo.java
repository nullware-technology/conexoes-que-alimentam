package com.nullware.conexoes_que_alimentam_backend.repositories;

import com.nullware.conexoes_que_alimentam_backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepo extends JpaRepository<User, UUID> {

  Optional<User> findByEmail(String email);

}
