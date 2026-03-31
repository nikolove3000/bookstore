package com.thanh.bookstore.service.model;

import com.thanh.bookstore.entity.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TokenPair {

    private String accessToken;
    private String refreshToken;
    private String username;
    private Role role;
}
