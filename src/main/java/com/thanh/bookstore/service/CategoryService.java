package com.thanh.bookstore.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thanh.bookstore.dto.CategoryDto;
import com.thanh.bookstore.entity.Category;
import com.thanh.bookstore.repository.CategoryRepository;

/** Service class for managing Category entities. */
@Service
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    /**
     * Get a list of all categories in the bookstore.
     * @return
     */
    public List<CategoryDto> getAllCategories() {

        return categoryRepository.findAll()
        .stream()
        .map(this::toDto)
        .toList();
    }

    /**
     * Get a category by its unique identifier.
     * @param id
     * @return
     */
    public CategoryDto getCategoryById(Long id) {
        
        Category category = categoryRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        return toDto(category);
    }
    
    /**
     * Convert a Category entity to a CategoryDto.
     * @param category
     * @return
     */
    private CategoryDto toDto(Category category) {
        
        Long bookCount = categoryRepository.countBooksByCategoryId(category.getId());
        return new CategoryDto(
            category.getId(),
            category.getName(),
            bookCount
        );
    }
}
