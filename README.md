# Mon vieux Grimoire

Projet web organisé en architecture `frontend/` et `backend/`.

## Structure du projet

- `frontend/`: application React créée avec Create React App.
- `backend/`: API Express / MongoDB.

## Prérequis

- Node.js (version 18+ recommandée)
- npm
- MongoDB (local ou Atlas)

## Installation

### Installer le backend

```bash
cd backend
npm install
```

### Installer le frontend

```bash
cd frontend
npm install
```

## Lancer le projet

### Démarrer le backend

```bash
cd backend
npm run dev
```

Le serveur écoute normalement sur `http://localhost:4000`.

### Démarrer le frontend

```bash
cd frontend
npm start
```

L'application React s'ouvre en général sur `http://localhost:3000`.

## Notes

- Le dossier `frontend/build` est ignoré par Git.
- Le dossier `frontend/node_modules` est ignoré par Git.
- Si vous utilisez VS Code, ouvrez la racine du dépôt et lancez les deux serveurs dans des terminaux séparés.
