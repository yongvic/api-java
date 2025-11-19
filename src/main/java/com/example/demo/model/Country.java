// src/main/java/com/example/demo/model/Country.java
package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "countries")
@Data
public class Country {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, length = 8, nullable = false)
    private String code;        // +237

    @Column(name = "iso_code", unique = true, length = 3)
    private String isoCode;     // CM

    @Column(nullable = false)
    private String name;

    private String flagEmoji;
}