package com.mindprojection.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;

public record ScheduleSlotRequest(
        @NotBlank @Size(max = 255) String title,
        String description,
        @NotNull OffsetDateTime startTime,
        @NotNull OffsetDateTime endTime,
        String recurrence,
        Long ideaNodeId
) {}
