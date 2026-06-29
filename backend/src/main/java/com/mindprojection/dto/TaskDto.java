package com.mindprojection.dto;

import java.time.OffsetDateTime;

public record TaskDto(
        Long id,
        Long ideaNodeId,
        String title,
        Boolean completed,
        Integer position,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
