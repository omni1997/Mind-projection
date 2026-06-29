package com.mindprojection.service;

import com.mindprojection.dto.ScheduleSlotDto;
import com.mindprojection.dto.ScheduleSlotRequest;
import com.mindprojection.model.ScheduleSlot;
import com.mindprojection.repository.ScheduleSlotRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScheduleSlotService {

    private final ScheduleSlotRepository repo;

    public List<ScheduleSlotDto> getByRange(OffsetDateTime start, OffsetDateTime end) {
        return repo.findByRange(start, end).stream().map(this::toDto).toList();
    }

    @Transactional
    public ScheduleSlotDto create(ScheduleSlotRequest req) {
        ScheduleSlot slot = ScheduleSlot.builder()
                .title(req.title())
                .description(req.description())
                .startTime(req.startTime())
                .endTime(req.endTime())
                .recurrence(req.recurrence())
                .build();
        return toDto(repo.save(slot));
    }

    @Transactional
    public ScheduleSlotDto update(Long id, ScheduleSlotRequest req) {
        ScheduleSlot slot = findOrThrow(id);
        slot.setTitle(req.title());
        slot.setDescription(req.description());
        slot.setStartTime(req.startTime());
        slot.setEndTime(req.endTime());
        slot.setRecurrence(req.recurrence());
        return toDto(repo.save(slot));
    }

    @Transactional
    public void delete(Long id) {
        repo.delete(findOrThrow(id));
    }

    private ScheduleSlot findOrThrow(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ScheduleSlot not found: " + id));
    }

    private ScheduleSlotDto toDto(ScheduleSlot s) {
        return new ScheduleSlotDto(s.getId(), s.getTitle(), s.getDescription(),
                s.getStartTime(), s.getEndTime(), s.getRecurrence(),
                s.getCreatedAt(), s.getUpdatedAt());
    }
}
