package com.thanh.bookstore.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing an author in the bookstore system.
 */
@Entity
@Table(name = "authors")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Author {

    /** Unique identifier of the author. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /** Name of the author. */
    @Column(name = "name")
    private String name;

    /** Short biography or description of the author. */
    @Column(name = "bio")
    private String bio;

    /** Books written by this author. */
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Book> books = new ArrayList<>();
}