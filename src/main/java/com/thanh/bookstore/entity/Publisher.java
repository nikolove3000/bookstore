package com.thanh.bookstore.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/** Represents a book publisher in the bookstore system. */
@Entity
@Table(name = "publishers")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Publisher {

    /** Unique identifier of the publisher. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /** Name of the publisher. */
    @Column(name = "name")
    private String name;

    /** Address of the publisher. */
    @Column(name = "address")
    private String address;

    /** Contact phone number of the publisher. */
    @Column(name = "phone")
    private String phone;

    /** Books published by this publisher. */
    @OneToMany(mappedBy = "publisher", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Book> books;
}