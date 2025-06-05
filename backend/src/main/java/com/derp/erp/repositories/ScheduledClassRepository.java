package com.derp.erp.repositories;

import com.derp.erp.models.ScheduledClass;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduledClassRepository extends MongoRepository<ScheduledClass, String> {

    List<ScheduledClass> findByCourse_Id(String courseId);

    List<ScheduledClass> findByDayOfWeek(String dayOfWeek);

    List<ScheduledClass> findByInstructorName(String instructorName);

    List<ScheduledClass> findByRoomNumberAndDayOfWeek(String roomNumber, String dayOfWeek);
    // Consider adding more specific queries as needed, e.g., checking for time overlaps.
} 