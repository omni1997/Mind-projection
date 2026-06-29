CREATE TABLE task (
    id           BIGSERIAL PRIMARY KEY,
    idea_node_id BIGINT       NOT NULL REFERENCES idea_node(id) ON DELETE CASCADE,
    title        VARCHAR(255) NOT NULL,
    completed    BOOLEAN      NOT NULL DEFAULT FALSE,
    position     INTEGER      NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_task_idea_node ON task(idea_node_id);
