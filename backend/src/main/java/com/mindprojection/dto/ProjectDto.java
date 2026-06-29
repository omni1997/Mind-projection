package com.mindprojection.dto;

import java.time.OffsetDateTime;
import java.util.List;

public record ProjectDto(
        Long id,
        String name,
        String description,
        List<TicketDto> tickets,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
