package com.mindprojection.controller;

import com.mindprojection.dto.ScheduleSlotDto;
import com.mindprojection.dto.ScheduleSlotRequest;
import com.mindprojection.service.ScheduleSlotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/schedule-slots")
@RequiredArgsConstructor
public class ScheduleSlotController {

    private final ScheduleSlotService service;

    @GetMapping
    public List<ScheduleSlotDto> getByRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime end) {
        return service.getByRange(start, end);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ScheduleSlotDto create(@Valid @RequestBody ScheduleSlotRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public ScheduleSlotDto update(@PathVariable Long id, @Valid @RequestBody ScheduleSlotRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
