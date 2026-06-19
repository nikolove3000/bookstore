package com.thanh.bookstore.specification;

import java.math.BigDecimal;

import org.springframework.data.jpa.domain.Specification;

import com.thanh.bookstore.entity.Author;
import com.thanh.bookstore.entity.Book;
import com.thanh.bookstore.entity.Category;

import jakarta.persistence.criteria.Join;

/**
 * Builds dynamic JPA Specifications for filtering books.
 */
public class BookSpecification {

    private BookSpecification() {
    }

    /**
     * Filters books belonging to the given category. No-op when categoryId is null.
     */
    public static Specification<Book> hasCategory(Long categoryId) {
        return (root, query, cb) -> {
            if (categoryId == null) {
                return cb.conjunction();
            }
            Join<Book, Category> categories = root.join("categories");
            return cb.equal(categories.get("id"), categoryId);
        };
    }

    /**
     * Filters books priced at or above the given minimum. No-op when minPrice is null.
     */
    public static Specification<Book> hasMinPrice(BigDecimal minPrice) {
        return (root, query, cb) -> minPrice == null
                ? cb.conjunction()
                : cb.greaterThanOrEqualTo(root.get("price"), minPrice);
    }

    /**
     * Filters books priced at or below the given maximum. No-op when maxPrice is null.
     */
    public static Specification<Book> hasMaxPrice(BigDecimal maxPrice) {
        return (root, query, cb) -> maxPrice == null
                ? cb.conjunction()
                : cb.lessThanOrEqualTo(root.get("price"), maxPrice);
    }

    /**
     * Filters books whose title, author name, or description match the keyword.
     * No-op when keyword is null or blank.
     */
    public static Specification<Book> matchesKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) {
                return cb.conjunction();
            }
            query.distinct(true);
            String pattern = "%" + keyword.toLowerCase() + "%";
            Join<Book, Author> author = root.join("author");
            return cb.or(
                    cb.like(cb.lower(root.get("title")), pattern),
                    cb.like(cb.lower(author.get("name")), pattern),
                    cb.like(cb.lower(root.get("description")), pattern)
            );
        };
    }
}