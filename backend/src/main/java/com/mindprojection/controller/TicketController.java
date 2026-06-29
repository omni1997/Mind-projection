package com.mindprojection.controller;

import com.mindprojection.dto.TicketDto;
import com.mindprojection.dto.TicketRequest;
import com.mindprojection.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class TicketController {

    private final TicketService service;

    @GetMapping("/projects/{projectId}/tickets")
    public List<TicketDto> getByProject(@PathVariable Long projectId) {
        return service.getByProject(projectId);
    }

    @GetMapping("/tickets/{id}")
    public TicketDto getById(@PathVariable Long id) { return service.getById(id); }

    @PostMapping("/projects/{projectId}/tickets")
    @ResponseStatus(HttpStatus.CREATED)
    public TicketDto create(@PathVariable Long projectId, @Valid @RequestBody TicketRequest req) {
        return service.create(projectId, req);
    }

    @PutMapping("/tickets/{id}")
    public TicketDto update(@PathVariable Long id, @Valid @RequestBody TicketRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/tickets/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }

    @PostMapping("/tickets/{ticketId}/tasks/{taskId}")
    public TicketDto linkTask(@PathVariable Long ticketId, @PathVariable Long taskId) {
        return service.linkTask(ticketId, taskId);
    }

    @DeleteMapping("/tickets/{ticketId}/tasks/{taskId}")
    public TicketDto unlinkTask(@PathVariable Long ticketId, @PathVariable Long taskId) {
        return service.unlinkTask(ticketId, taskId);
    }
}
