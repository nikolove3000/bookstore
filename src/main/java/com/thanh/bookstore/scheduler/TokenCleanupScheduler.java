package com.thanh.bookstore.scheduler;

import com.thanh.bookstore.repository.TokenBlacklistRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Scheduled component responsible for maintaining token blacklist integrity.
 *
 * <p>Role: Infrastructure Scheduler.</p>
 *
 * <p>Periodically removes expired blacklisted tokens to prevent
 * unnecessary data growth and ensure efficient token validation.</p>
 */
@Component
public class TokenCleanupScheduler {

    private final TokenBlacklistRepository tokenBlacklistRepository;

    /**
     * Creates the token cleanup scheduler.
     *
     * @param tokenBlacklistRepository repository managing blacklisted tokens
     */
    public TokenCleanupScheduler(TokenBlacklistRepository tokenBlacklistRepository) {
        this.tokenBlacklistRepository = tokenBlacklistRepository;
    }

    /**
     * Removes expired tokens from the blacklist.
     *
     * <p>Executed automatically every hour based on the configured cron expression.</p>
     */
    @Scheduled(cron = "0 0 * * * *")
    public void cleanExpiredToken() {

        tokenBlacklistRepository.deleteByExpiredAtBefore(LocalDateTime.now());
    }
}