# Mind-projection

App de gestion d'idées (arbre), planning et tickets.

## Stack
- Frontend : Angular 17+, TypeScript, Standalone Components, Signals, SCSS
- Backend : Spring Boot 3+, Java 21, REST API
- BDD : PostgreSQL 16
- Infra : Docker + Docker Compose

## Commandes
- `docker compose up` — lance tout
- `docker compose up frontend` — Angular seul
- `docker compose up backend` — Spring Boot seul
- `docker compose up db` — PostgreSQL seul
- `npm start` — dev Angular sans Docker (localhost:4200)
- `./mvnw spring-boot:run` — dev Spring Boot sans Docker (localhost:8080)

## Ports
- Frontend : 4200
- Backend : 8080
- PostgreSQL : 5432

## Structure
```
mind-projection/
├── frontend/          ← Angular
│   └── src/app/features/
│       ├── idea-tree/
│       ├── scheduler/
│       └── projects/
├── backend/           ← Spring Boot
│   └── src/main/java/
│       └── com/mindprojection/
│           ├── controller/
│           ├── service/
│           ├── repository/
│           └── model/
├── docker-compose.yml
└── CLAUDE.md
```

## Conventions Frontend
- Standalone components uniquement
- Signals pour la réactivité
- `inject()` pour les services
- Un composant par fichier

## Conventions Backend
- REST API sur `/api/v1/`
- DTOs pour les échanges frontend/backend
- Services séparés des controllers

## Features
1. **Idea Tree** — arbre d'idées interactif
2. **Scheduler** — emploi du temps
3. **Projects** — gestion de projets avec tickets

## BDD
- Host : db
- Port : 5432
- Database : mindprojection
- User : admin
