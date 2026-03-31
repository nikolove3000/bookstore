package com.thanh.bookstore.repository;

import com.thanh.bookstore.entity.TokenBlacklist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface TokenBlacklistRepository extends JpaRepository<TokenBlacklist, Long> {

    boolean existsByToken(String token);
    void deleteByExpiredAtBefore(LocalDateTime now);
}
