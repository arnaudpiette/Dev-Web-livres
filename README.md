# Mon vieux Grimoire


## Comment lancer le projet ? 

### Avec npm

Faites la commande `npm install` pour installer les dépendances puis `npm start` pour lancer le projet. 

Le projet a été testé sur node 19.

### Lancer le back-end

Dans un second terminal :

```bash
cd backend
npm install
npm run dev
```

L'API Express est alors disponible sur `http://localhost:4000`. La route
`GET /api/books` renvoie les premiers livres de démonstration et la route
`POST /api/books` reçoit un livre au format JSON.
