package com.mindprojection.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TaskRequest(
        @NotBlank @Size(max = 255) String title,
        Boolean completed,
        Integer position
) {}
