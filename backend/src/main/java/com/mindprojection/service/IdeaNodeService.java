package com.mindprojection.service;

import com.mindprojection.dto.IdeaNodeDto;
import com.mindprojection.dto.IdeaNodeRequest;
import com.mindprojection.dto.TaskDto;
import com.mindprojection.model.IdeaNode;
import com.mindprojection.model.Task;
import com.mindprojection.repository.IdeaNodeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IdeaNodeService {

    private final IdeaNodeRepository repo;

    public List<IdeaNodeDto> getTree() {
        return repo.findRoots().stream().map(this::toDto).toList();
    }

    public IdeaNodeDto getById(Long id) {
        return toDto(findOrThrow(id));
    }

    @Transactional
    public IdeaNodeDto create(IdeaNodeRequest req) {
        IdeaNode node = IdeaNode.builder()
                .title(req.title())
                .content(req.content())
                .position(req.position() != null ? req.position() : 0)
                .build();
        if (req.parentId() != null) {
            node.setParent(findOrThrow(req.parentId()));
        }
        return toDto(repo.save(node));
    }

    @Transactional
    public IdeaNodeDto update(Long id, IdeaNodeRequest req) {
        IdeaNode node = findOrThrow(id);
        node.setTitle(req.title());
        node.setContent(req.content());
        if (req.position() != null) node.setPosition(req.position());
        if (req.parentId() != null) {
            node.setParent(findOrThrow(req.parentId()));
        } else {
            node.setParent(null);
        }
        return toDto(repo.save(node));
    }

    @Transactional
    public void delete(Long id) {
        repo.delete(findOrThrow(id));
    }

    private IdeaNode findOrThrow(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("IdeaNode not found: " + id));
    }

    private IdeaNodeDto toDto(IdeaNode n) {
        List<TaskDto> tasks = n.getTasks() == null ? List.of() :
                n.getTasks().stream()
                        .sorted(java.util.Comparator.comparingInt(Task::getPosition))
                        .map(t -> new TaskDto(t.getId(), n.getId(), t.getTitle(),
                                t.getCompleted(), t.getPosition(), t.getCreatedAt(), t.getUpdatedAt()))
                        .toList();
        return new IdeaNodeDto(
                n.getId(),
                n.getTitle(),
                n.getContent(),
                n.getParent() != null ? n.getParent().getId() : null,
                n.getPosition(),
                n.getChildren().stream().map(this::toDto).toList(),
                tasks,
                n.getCreatedAt(),
                n.getUpdatedAt()
        );
    }
}
