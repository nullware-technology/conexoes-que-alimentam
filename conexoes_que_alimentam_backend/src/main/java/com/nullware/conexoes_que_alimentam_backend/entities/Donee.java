package com.nullware.conexoes_que_alimentam_backend.entities;

import java.util.ArrayList;
import java.util.List;

import com.nullware.conexoes_que_alimentam_backend.dtos.UserRegisterDTO;
import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "donees")
@DiscriminatorValue("DONEE")
public class Donee extends User {
    @OneToMany(mappedBy = "donee", cascade = CascadeType.ALL)
    private List<Donation> receivedDonations = new ArrayList<>();

    public Donee(UserRegisterDTO user, String password) {
        super(user.name(), user.email(), password, user.phone(), user.address());
    }

}
