package com.thanh.bookstore.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

/**
 * Book category in the bookstore system.
 */
@Entity
@Table(name = "categories")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Category {

    /** Unique identifier of the category. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /** Name of the category used to classify books. */
    @Column(name = "name")
    private String name;

    /** Books associated with this category. */
    @ManyToMany(mappedBy = "categories")
    private Set<Book> books = new HashSet<>();
}