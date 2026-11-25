const express = require('express');
const router = express.Router();

/**
 * Base de données en mémoire (Mock Database) pour dynamiser et professionnaliser l'API
 */
let users = [
    {
        id: 1,
        name: 'Ahmed Benali',
        email: 'ahmed@gmail.com',
        age: 22,
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        name: 'Sara Mansouri',
        email: 'sara.m@gmail.com',
        age: 24,
        createdAt: new Date().toISOString()
    }
];

// Compteur d'ID auto-incrémenté
let nextId = 3;

/**
 * Middleware de validation des données utilisateur
 */
function validateUserData(req, res, next) {
    const { name, email, age } = req.body;
    const errors = [];

    if (!name || typeof name !== 'string' || name.trim() === '') {
        errors.push("Le champ 'name' est obligatoire et doit être une chaîne non vide.");
    }

    if (!email || typeof email !== 'string') {
        errors.push("Le champ 'email' est obligatoire.");
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push("Le format de l'adresse email est invalide.");
        }
    }

    if (age === undefined || age === null || isNaN(Number(age)) || Number(age) <= 0) {
        errors.push("Le champ 'age' est obligatoire et doit être un nombre strictement positif.");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation des données échouée",
            errors
        });
    }

    next();
}

/**
 * =========================================================================
 * EXERCICE 2 - Route 1 : GET /api/users
 * Objectif TP : Afficher le message « Liste des utilisateurs »
 * Extension Pro : Retourne le message requis + la liste complète au format JSON
 * =========================================================================
 */
router.get('/users', (req, res) => {
    // Si le client demande du texte brut
    if (req.headers.accept && req.headers.accept.includes('text/plain')) {
        return res.status(200).send('Liste des utilisateurs');
    }

    // Réponse JSON moderne et structurée (contenant le message TP exact)
    return res.status(200).json({
        success: true,
        message: 'Liste des utilisateurs',
        count: users.length,
        data: users
    });
});

/**
 * =========================================================================
 * EXERCICE 2 - Route 2 : POST /api/users
 * Objectif TP : Récupérer les informations (name, email, age) avec req.body
 *               et les renvoyer dans la réponse.
 * Extension Pro : Validation stricte, persistance en mémoire, ID unique et code 201 Created.
 * =========================================================================
 */
router.post('/users', validateUserData, (req, res) => {
    const { name, email, age } = req.body;

    const newUser = {
        id: nextId++,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        age: Number(age),
        createdAt: new Date().toISOString()
    };

    // Ajout à la liste en mémoire
    users.push(newUser);

    // Réponse structurée avec statut 201 Created
    return res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès !',
        // Informations demandées par le TP
        receivedData: {
            name: newUser.name,
            email: newUser.email,
            age: newUser.age
        },
        user: newUser
    });
});

/**
 * =========================================================================
 * BONUS PRO : GET /api/users/:id - Obtenir un utilisateur par son identifiant
 * =========================================================================
 */
router.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: `Utilisateur avec l'ID ${userId} introuvable.`
        });
    }

    return res.status(200).json({
        success: true,
        data: user
    });
});

/**
 * =========================================================================
 * BONUS PRO : DELETE /api/users/:id - Supprimer un utilisateur
 * =========================================================================
 */
router.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const index = users.findIndex(u => u.id === userId);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: `Utilisateur avec l'ID ${userId} introuvable.`
        });
    }

    const deletedUser = users.splice(index, 1)[0];

    return res.status(200).json({
        success: true,
        message: 'Utilisateur supprimé avec succès.',
        deletedUser
    });
});

module.exports = router;
