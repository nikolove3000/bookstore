package com.thanh.bookstore.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.thanh.bookstore.service.FileStorageService;

/**
 * REST controller for file upload operations (admin only).
 */
@RestController
@RequestMapping("/api/admin/upload")
public class UploadController {

    private final FileStorageService fileStorageService;

    public UploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    /**
     * POST /api/admin/upload/cover
     * Uploads a book cover image and returns its full URL.
     */
    @PostMapping("/cover")
    public ResponseEntity<Map<String, String>> uploadCover(@RequestParam("file") MultipartFile file) {
        String path = fileStorageService.storeCoverImage(file);
        String fullUrl = "http://localhost:8080" + path;
        return ResponseEntity.ok(Map.of("url", fullUrl));
    }
}