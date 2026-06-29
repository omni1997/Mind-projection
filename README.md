# Mind Projection

App de gestion d'idées, planning et tickets.

## Features

- **Idea Tree** — arbre d'idées interactif et hiérarchique
- **Scheduler** — création et gestion d'emploi du temps
- **Project Manager** — gestion de projets avec tickets (Kanban)

## Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | Angular 17+, TypeScript, Standalone Components, Signals, SCSS |
| Backend | Spring Boot 3.2, Java 21, REST API |
| Base de données | PostgreSQL 16, migrations Flyway |
| Infra | Docker, Docker Compose |

## Démarrage rapide

### Avec Docker (recommandé)

```bash
docker compose up
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| Backend | http://localhost:8080/api/v1 |
| PostgreSQL | localhost:5432 |

### Sans Docker

**Frontend**
```bash
cd frontend
npm install
npm start
```

**Backend** (nécessite PostgreSQL local ou Docker DB)
```bash
docker compose up db   # lancer uniquement la DB
cd backend
./mvnw spring-boot:run
```

## Structure

```
mind-projection/
├── frontend/                        # Angular 17
│   └── src/app/features/
│       ├── idea-tree/
│       ├── scheduler/
│       └── projects/
├── backend/                         # Spring Boot 3
│   └── src/main/java/com/mindprojection/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── model/
│       ├── dto/
│       └── config/
├── docker-compose.yml
└── CLAUDE.md
```

## Configuration

Copier `.env.example` en `.env` et adapter les valeurs si besoin :

```bash
cp .env.example .env
```

| Variable | Valeur par défaut |
|----------|-------------------|
| `DB_HOST` | `db` |
| `DB_PORT` | `5432` |
| `DB_NAME` | `mindprojection` |
| `DB_USER` | `admin` |
| `DB_PASSWORD` | `admin` |

## Base de données

Les migrations sont gérées par Flyway et s'appliquent automatiquement au démarrage du backend.

| Table | Description |
|-------|-------------|
| `idea_node` | Nœuds de l'arbre d'idées |
| `schedule_slot` | Créneaux de l'emploi du temps |
| `project` | Projets |
| `ticket` | Tickets liés aux projets |
