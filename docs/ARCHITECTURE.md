# Architecture

Learning Tracker suit une architecture en couches classique afin de garder les responsabilités lisibles.

```text
React / Redux
    │  HTTP + JWT
    ▼
Contrôleurs REST
    ▼
Services métier
    ▼
Repositories Spring Data JPA
    ▼
MySQL
```

## Backend

- `controllers` expose les contrats HTTP et transforme les entités en DTO.
- `services` porte les opérations métier et les calculs de progression.
- `repositories` isole l’accès aux données avec Spring Data JPA.
- `security` valide les JWT et configure les autorisations par rôle.
- `config` contient l’initialisation optionnelle des données de démonstration.

L’API reste stateless : chaque requête protégée transporte un JWT dans l’en-tête `Authorization`.

## Frontend

- `pages` compose les écrans liés aux routes.
- `components` rassemble les éléments réutilisables.
- `features` contient l’état Redux par domaine.
- `services` centralise les appels HTTP via une instance Axios commune.
- `app/theme.js` définit les tokens visuels partagés.

En développement, Vite relaie `/api` vers Spring Boot. Dans Docker, Nginx sert les fichiers statiques, applique le fallback SPA et relaie le même chemin vers le conteneur backend.
