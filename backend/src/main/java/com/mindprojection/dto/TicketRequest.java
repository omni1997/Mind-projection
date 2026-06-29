package com.mindprojection.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TicketRequest(
        @NotBlank @Size(max = 255) String title,
        String description,
        String status,
        String priority,
        Integer position
) {}
