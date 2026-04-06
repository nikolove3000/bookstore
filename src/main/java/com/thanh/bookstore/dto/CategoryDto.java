package com.thanh.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data Transfer Object for Category entity.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {

    /** Unique identifier of the category. */
    private Long id;

    /** Name of the category used to classify books. */
    private String name;

    /** Number of books in the category. */
    private Long bookCount;
    
}
