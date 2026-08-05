# Learning Tracker

Une application full-stack de gestion de cours et de suivi de progression. Elle permet aux apprenants de parcourir des contenus, de marquer leur avancement et aux administrateurs de gérer le catalogue et les utilisateurs.

## Aperçu

- Authentification stateless par JWT et rôles `USER` / `ADMIN`
- Routes privées côté interface et autorisations contrôlées côté API
- Catalogue de cours et de contenus pédagogiques
- Progression globale, par cours et par contenu
- Tableau de bord d’administration
- API documentée avec OpenAPI / Swagger
- Environnement complet reproductible avec Docker Compose

## Stack technique

| Couche | Technologies |
| --- | --- |
| Frontend | React 19, Vite, Redux Toolkit, Material UI |
| Backend | Java 21, Spring Boot, Spring Security, Spring Data JPA |
| Données | MySQL 8.4 en production, H2 pour les tests |
| Qualité | JUnit, ESLint, GitHub Actions, Docker multi-stage |

## Démarrage rapide avec Docker

Prérequis : Docker Desktop avec Docker Compose.

```bash
cp .env.example .env
docker compose up --build
```

Ouvrez ensuite [http://localhost:3000](http://localhost:3000).

Le mode Docker initialise trois cours de démonstration et un compte administrateur local :

- utilisateur : `demo-admin`
- mot de passe : `demo-password`

Ces identifiants sont uniquement destinés à la démonstration locale. Modifiez-les dans `.env` avant tout déploiement.

Pour arrêter l’application :

```bash
docker compose down
```

Ajoutez `-v` uniquement si vous souhaitez aussi supprimer les données MySQL locales.

## Lancement en développement

Prérequis : Java 21, Maven 3.9+, Node.js 22+ et MySQL 8+.

1. Créez une base `learningtracker` et configurez si nécessaire `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` et `JWT_SECRET`.
2. Lancez l’API depuis la racine :

```bash
./mvnw spring-boot:run
```

3. Dans un second terminal, lancez le frontend :

```bash
cd frontend
npm ci
npm run dev
```

Vite sert l’interface sur `http://localhost:5173` et relaie `/api` vers `http://localhost:8080`.

## Tests et contrôles qualité

```bash
./mvnw test
cd frontend
npm run lint
npm run build
```

L’interface Swagger est disponible sur `http://localhost:8080/swagger-ui/index.html` lorsque l’API est lancée.

## Configuration

Les principales variables sont documentées dans [`.env.example`](.env.example). En dehors du profil de test, l’inscription publique crée toujours un compte `USER` : le rôle envoyé par le client n’est jamais utilisé pour obtenir des privilèges administrateur.

Pour comprendre les choix de structure et les flux principaux, consultez [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
