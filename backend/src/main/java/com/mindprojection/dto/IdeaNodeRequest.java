package com.mindprojection.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record IdeaNodeRequest(
        @NotBlank @Size(max = 255) String title,
        String content,
        Long parentId,
        Integer position
) {}
