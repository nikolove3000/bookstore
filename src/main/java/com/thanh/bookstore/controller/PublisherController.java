package com.thanh.bookstore.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thanh.bookstore.dto.CreatePublisherRequest;
import com.thanh.bookstore.dto.PublisherDto;
import com.thanh.bookstore.entity.Publisher;
import com.thanh.bookstore.repository.PublisherRepository;

import jakarta.validation.Valid;

/**
 * REST controller for publisher listing.
 */
@RestController
@RequestMapping("/api/publishers")
public class PublisherController {

    private final PublisherRepository publisherRepository;

    public PublisherController(PublisherRepository publisherRepository) {
        this.publisherRepository = publisherRepository;
    }

    /**
     * GET /api/publishers Returns all publishers.
     */
    @GetMapping
    public ResponseEntity<List<PublisherDto>> getAllPublishers() {
        List<PublisherDto> publishers = publisherRepository.findAll().stream()
                .map(this::toDto)
                .toList();
        return ResponseEntity.ok(publishers);
    }

    private PublisherDto toDto(Publisher p) {
        return new PublisherDto(p.getId(), p.getName(), p.getAddress(), p.getPhone());
    }

    @PostMapping
    public ResponseEntity<PublisherDto> createPublisher(@Valid @RequestBody CreatePublisherRequest request) {
        Publisher p = new Publisher();
        p.setName(request.getName());
        p.setAddress(request.getAddress());
        p.setPhone(request.getPhone());
        Publisher saved = publisherRepository.save(p);
        return ResponseEntity.ok(toDto(saved));
    }
}
