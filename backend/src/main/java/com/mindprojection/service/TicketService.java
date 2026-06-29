package com.mindprojection.service;

import com.mindprojection.dto.*;
import com.mindprojection.model.Project;
import com.mindprojection.model.Task;
import com.mindprojection.model.Ticket;
import com.mindprojection.repository.ProjectRepository;
import com.mindprojection.repository.TaskRepository;
import com.mindprojection.repository.TicketRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TicketService {

    private final TicketRepository ticketRepo;
    private final ProjectRepository projectRepo;
    private final TaskRepository taskRepo;

    public List<TicketDto> getByProject(Long projectId) {
        return ticketRepo.findByProjectIdOrderByPositionAsc(projectId)
                .stream().map(this::toDto).toList();
    }

    public TicketDto getById(Long id) {
        return toDto(findOrThrow(id));
    }

    @Transactional
    public TicketDto create(Long projectId, TicketRequest req) {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found: " + projectId));
        Ticket ticket = Ticket.builder()
                .project(project)
                .title(req.title())
                .description(req.description())
                .status(req.status() != null ? req.status() : "TODO")
                .priority(req.priority() != null ? req.priority() : "MEDIUM")
                .position(req.position() != null ? req.position() : 0)
                .build();
        return toDto(ticketRepo.save(ticket));
    }

    @Transactional
    public TicketDto update(Long id, TicketRequest req) {
        Ticket ticket = findOrThrow(id);
        ticket.setTitle(req.title());
        if (req.description() != null) ticket.setDescription(req.description());
        if (req.status() != null) ticket.setStatus(req.status());
        if (req.priority() != null) ticket.setPriority(req.priority());
        if (req.position() != null) ticket.setPosition(req.position());
        return toDto(ticketRepo.save(ticket));
    }

    @Transactional
    public void delete(Long id) {
        ticketRepo.delete(findOrThrow(id));
    }

    @Transactional
    public TicketDto linkTask(Long ticketId, Long taskId) {
        Ticket ticket = findOrThrow(ticketId);
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found: " + taskId));
        if (!ticket.getTasks().contains(task)) {
            ticket.getTasks().add(task);
        }
        return toDto(ticketRepo.save(ticket));
    }

    @Transactional
    public TicketDto unlinkTask(Long ticketId, Long taskId) {
        Ticket ticket = findOrThrow(ticketId);
        ticket.getTasks().removeIf(t -> t.getId().equals(taskId));
        return toDto(ticketRepo.save(ticket));
    }

    private Ticket findOrThrow(Long id) {
        return ticketRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found: " + id));
    }

    public TicketDto toDto(Ticket t) {
        List<TaskRefDto> tasks = t.getTasks().stream()
                .map(task -> new TaskRefDto(task.getId(), task.getTitle(), task.getCompleted()))
                .toList();
        return new TicketDto(t.getId(), t.getProject().getId(), t.getTitle(), t.getDescription(),
                t.getStatus(), t.getPriority(), t.getPosition(), tasks,
                t.getCreatedAt(), t.getUpdatedAt());
    }
}
