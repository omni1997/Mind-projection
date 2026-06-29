package com.mindprojection.repository;

import com.mindprojection.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByIdeaNodeIdOrderByPositionAsc(Long ideaNodeId);
}
