package com.mindprojection.repository;

import com.mindprojection.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByProjectIdOrderByPositionAsc(Long projectId);
}
