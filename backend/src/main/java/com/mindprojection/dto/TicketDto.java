package com.mindprojection.dto;

import java.time.OffsetDateTime;
import java.util.List;

public record TicketDto(
        Long id,
        Long projectId,
        String title,
        String description,
        String status,
        String priority,
        Integer position,
        List<TaskRefDto> tasks,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
