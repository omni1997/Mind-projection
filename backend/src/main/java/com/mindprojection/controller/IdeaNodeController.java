package com.mindprojection.controller;

import com.mindprojection.dto.IdeaNodeDto;
import com.mindprojection.dto.IdeaNodeRequest;
import com.mindprojection.service.IdeaNodeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/idea-nodes")
@RequiredArgsConstructor
public class IdeaNodeController {

    private final IdeaNodeService service;

    @GetMapping
    public List<IdeaNodeDto> getTree() {
        return service.getTree();
    }

    @GetMapping("/{id}")
    public IdeaNodeDto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IdeaNodeDto create(@Valid @RequestBody IdeaNodeRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public IdeaNodeDto update(@PathVariable Long id, @Valid @RequestBody IdeaNodeRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
