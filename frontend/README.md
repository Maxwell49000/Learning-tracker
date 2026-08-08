# Frontend Learning Tracker

Interface React de Learning Tracker, construite avec Vite, Redux Toolkit et Material UI.

## Commandes

```bash
npm ci
npm run dev
npm run lint
npm run build
npm run preview
```

Le serveur de développement est disponible sur `http://localhost:5173`. Les requêtes vers `/api` sont relayées vers `http://localhost:8080`.

## Organisation

```text
src
├── app/          store Redux, hooks typés et thème Material UI
├── components/   navigation, cartes, dialogues et gardes de routes
├── features/     état d’authentification et catalogue de cours
├── hooks/        chargement des progressions
├── pages/        accueil, authentification, cours et administration
├── routes/       routes publiques et protégées
└── services/     client Axios et appels vers l’API
```

## Identité visuelle

Le thème centralise la palette, la typographie, les espacements et les variantes Material UI dans `src/app/theme.js`. Les composants partagés assurent la cohérence des cartes, formulaires, listes d’administration et états de progression.

Palette principale :

- bleu encre `#14213D` ;
- vermillon `#E85D3F` ;
- ivoire `#FFFDF7` ;
- fond sable `#F3F0E8`.

## Authentification

Le JWT est conservé localement pour restaurer la session après actualisation. L’instance Axios commune ajoute le jeton aux appels protégés. Les composants `RequireAuth` et `RequireAdmin` contrôlent l’accès aux écrans, en complément des autorisations appliquées par l’API.

## Production

Le Dockerfile produit le build Vite dans une image Node.js, puis copie les fichiers dans une image Nginx légère. La configuration Nginx :

- sert la SPA ;
- redirige les routes inconnues vers `index.html` ;
- relaie `/api` vers le backend Docker.
