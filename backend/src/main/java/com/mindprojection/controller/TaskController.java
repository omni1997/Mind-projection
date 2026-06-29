package com.mindprojection.controller;

import com.mindprojection.dto.TaskDto;
import com.mindprojection.dto.TaskRequest;
import com.mindprojection.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/idea-nodes/{nodeId}/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService service;

    @GetMapping
    public List<TaskDto> getByNode(@PathVariable Long nodeId) {
        return service.getByNode(nodeId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskDto create(@PathVariable Long nodeId, @Valid @RequestBody TaskRequest req) {
        return service.create(nodeId, req);
    }

    @PatchMapping("/{id}/toggle")
    public TaskDto toggle(@PathVariable Long nodeId, @PathVariable Long id) {
        return service.toggle(id);
    }

    @PutMapping("/{id}")
    public TaskDto update(@PathVariable Long nodeId, @PathVariable Long id, @Valid @RequestBody TaskRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long nodeId, @PathVariable Long id) {
        service.delete(id);
    }
}
