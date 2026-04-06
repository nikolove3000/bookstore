package com.thanh.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data Transfer Object for Author entity.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuthorDto {
    
    /** The unique identifier for the author. */
    private Long id;

    /** The name of the author. */
    private String name;

    /** The biography of the author. */
    private String bio;

    /** The number of books written by the author. */
    private Long bookCount; 

}
