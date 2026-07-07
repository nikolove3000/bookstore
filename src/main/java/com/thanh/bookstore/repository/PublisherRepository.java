package com.thanh.bookstore.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thanh.bookstore.entity.Publisher;

/**
 * Repository for Publisher entity.
 */
@Repository
public interface PublisherRepository extends JpaRepository<Publisher, Long> {

    /** Finds a publisher by name. */
    Optional<Publisher> findByName(String name);

    /** Checks if a publisher with the given name exists. */
    boolean existsByName(String name);
}