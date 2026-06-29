CREATE TABLE task_ticket (
    task_id   BIGINT NOT NULL REFERENCES task(id)   ON DELETE CASCADE,
    ticket_id BIGINT NOT NULL REFERENCES ticket(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, ticket_id)
);

CREATE INDEX idx_task_ticket_ticket ON task_ticket(ticket_id);
