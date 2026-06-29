package com.mindprojection.dto;

import java.time.OffsetDateTime;
import java.util.List;

public record IdeaNodeDto(
        Long id,
        String title,
        String content,
        Long parentId,
        Integer position,
        List<IdeaNodeDto> children,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
