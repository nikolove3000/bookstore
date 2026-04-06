package com.thanh.bookstore.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thanh.bookstore.dto.CategoryDto;
import com.thanh.bookstore.service.CategoryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * REST controller for managing book categories in the bookstore system.
 */
@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    /**
     * Get a list of all categories in the bookstore.
     * @return
     */
    @GetMapping()
    public ResponseEntity<List<CategoryDto>> getAllCategories() {

        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    /**
     * Get a category by its unique identifier.
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategoryById(@PathVariable Long id) {

        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

}
