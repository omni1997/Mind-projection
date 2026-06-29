-- Idea Tree : nœuds d'idées hiérarchiques
CREATE TABLE idea_node (
    id         BIGSERIAL PRIMARY KEY,
    title      VARCHAR(255) NOT NULL,
    content    TEXT,
    parent_id  BIGINT REFERENCES idea_node(id) ON DELETE CASCADE,
    position   INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Scheduler : créneaux horaires
CREATE TABLE schedule_slot (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    start_time  TIMESTAMPTZ NOT NULL,
    end_time    TIMESTAMPTZ NOT NULL,
    recurrence  VARCHAR(50),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project Manager : projets
CREATE TABLE project (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project Manager : tickets
CREATE TABLE ticket (
    id          BIGSERIAL PRIMARY KEY,
    project_id  BIGINT NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    status      VARCHAR(50) NOT NULL DEFAULT 'TODO'
                    CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')),
    priority    VARCHAR(50) NOT NULL DEFAULT 'MEDIUM'
                    CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    position    INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_idea_node_parent ON idea_node(parent_id);
CREATE INDEX idx_ticket_project   ON ticket(project_id);
CREATE INDEX idx_ticket_status    ON ticket(status);
