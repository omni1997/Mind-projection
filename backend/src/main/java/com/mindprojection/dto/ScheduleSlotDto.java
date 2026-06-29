package com.mindprojection.dto;

import java.time.OffsetDateTime;

public record ScheduleSlotDto(
        Long id,
        String title,
        String description,
        OffsetDateTime startTime,
        OffsetDateTime endTime,
        String recurrence,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
