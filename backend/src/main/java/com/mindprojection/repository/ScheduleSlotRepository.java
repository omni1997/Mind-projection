package com.mindprojection.repository;

import com.mindprojection.model.ScheduleSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;

public interface ScheduleSlotRepository extends JpaRepository<ScheduleSlot, Long> {

    @Query("SELECT s FROM ScheduleSlot s LEFT JOIN FETCH s.ideaNode WHERE s.startTime < :end AND s.endTime > :start ORDER BY s.startTime ASC")
    List<ScheduleSlot> findByRange(@Param("start") OffsetDateTime start, @Param("end") OffsetDateTime end);

    @Query("SELECT s FROM ScheduleSlot s LEFT JOIN FETCH s.ideaNode WHERE s.ideaNode.id = :ideaNodeId ORDER BY s.startTime ASC")
    List<ScheduleSlot> findByIdeaNodeId(@Param("ideaNodeId") Long ideaNodeId);
}
