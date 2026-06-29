package com.mindprojection.service;

import com.mindprojection.dto.ScheduleSlotDto;
import com.mindprojection.dto.ScheduleSlotRequest;
import com.mindprojection.model.IdeaNode;
import com.mindprojection.model.ScheduleSlot;
import com.mindprojection.repository.IdeaNodeRepository;
import com.mindprojection.repository.ScheduleSlotRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScheduleSlotService {

    private static final int RECURRENCE_OCCURRENCES = 12;

    private final ScheduleSlotRepository repo;
    private final IdeaNodeRepository ideaNodeRepo;

    public List<ScheduleSlotDto> getByRange(OffsetDateTime start, OffsetDateTime end) {
        return repo.findByRange(start, end).stream().map(this::toDto).toList();
    }

    public List<ScheduleSlotDto> getByIdeaNode(Long ideaNodeId) {
        return repo.findByIdeaNodeId(ideaNodeId).stream().map(this::toDto).toList();
    }

    @Transactional
    public List<ScheduleSlotDto> create(ScheduleSlotRequest req) {
        IdeaNode ideaNode = resolveIdeaNode(req.ideaNodeId());
        List<ScheduleSlot> slots = buildOccurrences(req, ideaNode);
        return repo.saveAll(slots).stream().map(this::toDto).toList();
    }

    @Transactional
    public ScheduleSlotDto update(Long id, ScheduleSlotRequest req) {
        ScheduleSlot slot = findOrThrow(id);
        slot.setTitle(req.title());
        slot.setDescription(req.description());
        slot.setStartTime(req.startTime());
        slot.setEndTime(req.endTime());
        slot.setRecurrence(req.recurrence());
        slot.setIdeaNode(resolveIdeaNode(req.ideaNodeId()));
        return toDto(repo.save(slot));
    }

    @Transactional
    public void delete(Long id) {
        repo.delete(findOrThrow(id));
    }

    private List<ScheduleSlot> buildOccurrences(ScheduleSlotRequest req, IdeaNode ideaNode) {
        List<ScheduleSlot> result = new ArrayList<>();
        String recurrence = req.recurrence();
        int count = (recurrence == null || recurrence.isBlank()) ? 1 : RECURRENCE_OCCURRENCES;

        for (int i = 0; i < count; i++) {
            OffsetDateTime start = shift(req.startTime(), recurrence, i);
            OffsetDateTime end   = shift(req.endTime(),   recurrence, i);
            result.add(ScheduleSlot.builder()
                    .title(req.title())
                    .description(req.description())
                    .startTime(start)
                    .endTime(end)
                    .recurrence(recurrence)
                    .ideaNode(ideaNode)
                    .build());
        }
        return result;
    }

    private OffsetDateTime shift(OffsetDateTime base, String recurrence, int i) {
        if (recurrence == null || i == 0) return base;
        return switch (recurrence) {
            case "DAILY"   -> base.plus(i, ChronoUnit.DAYS);
            case "WEEKLY"  -> base.plus(i, ChronoUnit.WEEKS);
            case "MONTHLY" -> base.plusMonths(i);
            default        -> base;
        };
    }

    private IdeaNode resolveIdeaNode(Long id) {
        if (id == null) return null;
        return ideaNodeRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("IdeaNode not found: " + id));
    }

    private ScheduleSlot findOrThrow(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ScheduleSlot not found: " + id));
    }

    private ScheduleSlotDto toDto(ScheduleSlot s) {
        return new ScheduleSlotDto(
                s.getId(), s.getTitle(), s.getDescription(),
                s.getStartTime(), s.getEndTime(), s.getRecurrence(),
                s.getIdeaNode() != null ? s.getIdeaNode().getId()    : null,
                s.getIdeaNode() != null ? s.getIdeaNode().getTitle() : null,
                s.getCreatedAt(), s.getUpdatedAt());
    }
}
