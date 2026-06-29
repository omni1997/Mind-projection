package com.mindprojection.service;

import com.mindprojection.dto.*;
import com.mindprojection.model.Project;
import com.mindprojection.model.Task;
import com.mindprojection.model.Ticket;
import com.mindprojection.repository.ProjectRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository repo;

    public List<ProjectDto> getAll() {
        return repo.findAll().stream().map(this::toDto).toList();
    }

    public ProjectDto getById(Long id) {
        return toDto(findOrThrow(id));
    }

    @Transactional
    public ProjectDto create(ProjectRequest req) {
        return toDto(repo.save(Project.builder()
                .name(req.name())
                .description(req.description())
                .build()));
    }

    @Transactional
    public ProjectDto update(Long id, ProjectRequest req) {
        Project p = findOrThrow(id);
        p.setName(req.name());
        p.setDescription(req.description());
        return toDto(repo.save(p));
    }

    @Transactional
    public void delete(Long id) {
        repo.delete(findOrThrow(id));
    }

    private Project findOrThrow(Long id) {
        return repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Project not found: " + id));
    }

    public ProjectDto toDto(Project p) {
        return new ProjectDto(p.getId(), p.getName(), p.getDescription(),
                p.getTickets().stream().map(t -> toTicketDto(t, p.getId())).toList(),
                p.getCreatedAt(), p.getUpdatedAt());
    }

    private TicketDto toTicketDto(Ticket t, Long projectId) {
        List<TaskRefDto> tasks = t.getTasks().stream()
                .map(task -> new TaskRefDto(task.getId(), task.getTitle(), task.getCompleted()))
                .toList();
        return new TicketDto(t.getId(), projectId, t.getTitle(), t.getDescription(),
                t.getStatus(), t.getPriority(), t.getPosition(), tasks,
                t.getCreatedAt(), t.getUpdatedAt());
    }

    public static TicketRefDto toTicketRef(Ticket t) {
        return new TicketRefDto(t.getId(), t.getProject().getId(), t.getTitle(), t.getStatus(), t.getPriority());
    }
}
