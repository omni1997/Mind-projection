ALTER TABLE schedule_slot
    ADD COLUMN idea_node_id    BIGINT REFERENCES idea_node(id) ON DELETE SET NULL,
    ADD COLUMN recurrence_rule VARCHAR(50);

CREATE INDEX idx_schedule_slot_idea ON schedule_slot(idea_node_id);
