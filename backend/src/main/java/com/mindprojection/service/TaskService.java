package com.mindprojection.service;

import com.mindprojection.dto.TaskDto;
import com.mindprojection.dto.TaskRequest;
import com.mindprojection.dto.TicketRefDto;
import com.mindprojection.model.IdeaNode;
import com.mindprojection.model.Task;
import com.mindprojection.repository.IdeaNodeRepository;
import com.mindprojection.repository.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskService {

    private final TaskRepository taskRepo;
    private final IdeaNodeRepository nodeRepo;

    public List<TaskDto> getByNode(Long nodeId) {
        return taskRepo.findByIdeaNodeIdOrderByPositionAsc(nodeId)
                .stream().map(this::toDto).toList();
    }

    @Transactional
    public TaskDto create(Long nodeId, TaskRequest req) {
        IdeaNode node = nodeRepo.findById(nodeId)
                .orElseThrow(() -> new EntityNotFoundException("IdeaNode not found: " + nodeId));
        Task task = Task.builder()
                .ideaNode(node)
                .title(req.title())
                .completed(req.completed() != null ? req.completed() : false)
                .position(req.position() != null ? req.position() : 0)
                .build();
        return toDto(taskRepo.save(task));
    }

    @Transactional
    public TaskDto toggle(Long id) {
        Task task = findOrThrow(id);
        task.setCompleted(!task.getCompleted());
        return toDto(taskRepo.save(task));
    }

    @Transactional
    public TaskDto update(Long id, TaskRequest req) {
        Task task = findOrThrow(id);
        task.setTitle(req.title());
        if (req.completed() != null) task.setCompleted(req.completed());
        if (req.position() != null) task.setPosition(req.position());
        return toDto(taskRepo.save(task));
    }

    @Transactional
    public void delete(Long id) {
        taskRepo.delete(findOrThrow(id));
    }

    private Task findOrThrow(Long id) {
        return taskRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found: " + id));
    }

    public TaskDto toDto(Task t) {
        List<TicketRefDto> tickets = t.getTickets() == null ? List.of() :
                t.getTickets().stream()
                        .map(ProjectService::toTicketRef)
                        .toList();
        return new TaskDto(t.getId(), t.getIdeaNode().getId(),
                t.getTitle(), t.getCompleted(), t.getPosition(), tickets,
                t.getCreatedAt(), t.getUpdatedAt());
    }
}
