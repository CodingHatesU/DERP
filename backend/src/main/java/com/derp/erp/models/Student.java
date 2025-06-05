package com.derp.erp.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Document(collection = "students")
@Getter
@Setter
@NoArgsConstructor
public class Student {

    @Id
    private String id;

    private String firstName;

    private String lastName;

    @Indexed(unique = true)
    private String email;

    @Indexed(unique = true)
    private String studentIdNumber;

    public Student(String firstName, String lastName, String email, String studentIdNumber) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.studentIdNumber = studentIdNumber;
    }
} 