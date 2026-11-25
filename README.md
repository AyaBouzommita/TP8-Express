# 📘 TP N°8 — Développement Backend avec Express.js & EJS

Ce projet implémente l'intégralité du **TP N°8** en respectant scrupuleusement les exigences de l'énoncé, enrichi d'une architecture professionnelle moderne, d'un design soigné (Tailwind CSS, Glassmorphism), de validations rigoureuses, d'un tableau de bord interactif et de tests automatisés.

---

## 📁 Structure du Projet

```text
TP8-Express/
│
├── node_modules/                  # Dépendances du projet (Express, EJS, Morgan, Dotenv)
├── routes/
│   └── user.js                    # Routeur modulaire (express.Router()) pour /api/users
│
├── views/
│   ├── open.ejs                   # Template EJS rendu quand 8h <= heure < 18h
│   └── close.ejs                  # Template EJS rendu en dehors des heures d'ouverture
│
├── server.js                      # Point d'entrée principal du serveur Express (Port 5000)
├── package.json                   # Métadonnées, scripts de démarrage et dépendances
├── test-api.js                    # Script de tests automatisés de toutes les routes
├── TP8_Postman_Collection.json    # Collection Postman prête à importer en 1 clic
└── README.md                      # Documentation complète du TP
```

---

## 🚀 Démarrage Rapide

### 1. Installation des dépendances
Si ce n'est pas déjà fait :
```bash
cd TP8-Express
npm install
```

### 2. Démarrage du serveur
```bash
npm start
```
*Le serveur démarrera sur le port **5000** et affichera dans la console :*
```text
=============================================================
🚀 Serveur Express démarré avec succès !
📍 Port : 5000
🌐 Dashboard : http://localhost:5000
🔗 API Users : http://localhost:5000/api/users
🛍️  Boutique EJS : http://localhost:5000/shop
=============================================================
```

Pour le mode développement avec rechargement automatique :
```bash
npm run dev
```

---

## 📌 Récapitulatif des Exercices & Réponses

### Partie 1 : Création d'un serveur Express et gestion des routes

#### Exercice 1 : Installation et configuration d'Express
- Module Express initialisé dans `server.js`.
- Port configuré à **5000**.
- Démarrage effectué via `app.listen(PORT, callback)` avec message clair dans la console.
- Accès vérifié sur `http://localhost:5000`.

#### Exercice 2 : Création et organisation des routes
- Création du dossier `routes/` et du fichier `user.js`.
- Utilisation de `express.Router()`.
- Middleware `express.json()` activé dans `server.js` pour permettre à `req.body` de récupérer les requêtes JSON.
- Montage du routeur avec le préfixe `/api` via `app.use('/api', userRoutes)`.
- Deux routes implémentées :
  1. **GET `/api/users`** : Affiche le message obligatoire *« Liste des utilisateurs »*.
  2. **POST `/api/users`** : Récupère `name`, `email` et `age` dans `req.body` et les renvoie dans la réponse.

#### Exercice 3 : Tests avec Postman
Le fichier `TP8_Postman_Collection.json` est fourni à la racine. Vous pouvez directement l'importer dans Postman !

---

## 🧪 Guide de Test des Routes

### Test 1 : Requête GET (Liste des utilisateurs)
- **Méthode** : `GET`
- **URL** : `http://localhost:5000/api/users`
- **Réponse HTTP 200** :
```json
{
  "success": true,
  "message": "Liste des utilisateurs",
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "Ahmed Benali",
      "email": "ahmed@gmail.com",
      "age": 22
    }
  ]
}
```

### Test 2 : Requête POST (Création d'un utilisateur avec req.body)
- **Méthode** : `POST`
- **URL** : `http://localhost:5000/api/users`
- **Headers** : `Content-Type: application/json`
- **Body (raw JSON)** :
```json
{
  "name": "Ahmed",
  "email": "ahmed@gmail.com",
  "age": 22
}
```
- **Réponse HTTP 201** :
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès !",
  "receivedData": {
    "name": "Ahmed",
    "email": "ahmed@gmail.com",
    "age": 22
  },
  "user": {
    "id": 3,
    "name": "Ahmed",
    "email": "ahmed@gmail.com",
    "age": 22,
    "createdAt": "2026-11-25T17:30:00.000Z"
  }
}
```

---

### Partie 2 : Moteur de Templates EJS

#### Exercice 4 : Installation et configuration d'EJS
- EJS installé (`npm install ejs`).
- Configuration dans `server.js` :
  ```javascript
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  ```
- Création des vues `views/open.ejs` et `views/close.ejs` avec les messages exacts demandés :
  - `open.ejs` : **« Bienvenue ! Notre boutique est actuellement ouverte. »**
  - `close.ejs` : **« Désolé, notre boutique est actuellement fermée. »**

#### Exercice 5 : Affichage conditionnel d'une page avec EJS
- Route créée : `GET /shop`.
- Heure récupérée dynamiquement via JavaScript (`new Date().getHours()`).
- Règle de condition :
  ```javascript
  const currentHour = new Date().getHours();
  if (currentHour >= 8 && currentHour < 18) {
      res.render('open', { ... });
  } else {
      res.render('close', { ... });
  }
  ```
- **Option de simulation Pro** :
  - Pour tester la vue ouverte : `http://localhost:5000/shop?hour=10`
  - Pour tester la vue fermée : `http://localhost:5000/shop?hour=22`

---

## ⚡ Fonctionnalités Avancées "Pro" Ajoutées

1. **Dashboard Interactif d'accueil (`GET /`)** : Une interface web moderne avec testeur d'API intégré directement dans le navigateur, permettant d'envoyer des requêtes POST et GET en direct.
2. **Validation stricte des données entrantes** : Vérification des champs `name`, `email` (format regex valide) et `age` (nombre positif), avec retour HTTP 400 détaillé si des données manquent.
3. **Persistance en mémoire & IDs uniques** : Chaque utilisateur créé est stocké avec un identifiant unique et une date de création (`createdAt`).
4. **Design EJS haut de gamme** : Pages construites avec Tailwind CSS, polices modernes, icônes FontAwesome, calcul du temps restant avant fermeture/ouverture.
5. **Simulateur d'heure pour soutenance** : Paramètre `?hour=` sur `/shop` pour démontrer instantanément les deux états (ouvert/fermé) au professeur sans modifier l'horloge système de l'ordinateur.
6. **Journalisation Morgan** : Affichage coloré et précis des requêtes HTTP reçues dans le terminal.
7. **Suite de tests automatisée** : Exécutez `npm test` pour vérifier en 1 seconde la conformité de l'ensemble du TP.

---

## 🧪 Exécution des Tests Automatisés

Dans le terminal, lancez :
```bash
npm test
```
Le script vérifiera automatiquement :
- L'accessibilité de la racine (`/`).
- La conformité du message `GET /api/users`.
- La récupération correcte de `req.body` sur `POST /api/users`.
- Le rejet des payloads invalides avec HTTP 400.
- Le rendu des templates EJS conditionnels pour les plages ouvertes et fermées.
