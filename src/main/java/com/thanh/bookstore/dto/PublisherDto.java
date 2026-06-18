package com.thanh.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO for transferring publisher data.
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PublisherDto {

    /** Unique identifier of the publisher. */
    private Long id;

    /** Name of the publisher. */
    private String name;

    /** Address of the publisher. */
    private String address;

    /** Contact phone number of the publisher. */
    private String phone;
}