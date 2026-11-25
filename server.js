/**
 * ============================================================================
 * TP N°8 — Développement Backend avec Express.js & EJS
 * ============================================================================
 * Auteur : TP8 Developer Pro
 * Description : Serveur Express avec gestion des routes modulaires,
 *               récupération de corps de requête JSON (req.body),
 *               et moteur de rendu de templates EJS dynamique avec condition d'heure.
 * ============================================================================
 */

const express = require('express');
const path = require('path');
const morgan = require('morgan');

// ============================================================================
// EXERCICE 2 - Étape 1 : Importer le routeur utilisateur
// ============================================================================
const userRoutes = require('./routes/user');

// ============================================================================
// EXERCICE 1 - Étape 6 : Initialisation de l'application Express
// ============================================================================
const app = express();

// ============================================================================
// EXERCICE 1 - Étape 6 : Définition du Port d'écoute (5000)
// ============================================================================
const PORT = process.env.PORT || 5000;

// ============================================================================
// CONFIGURATION DES MIDDLEWARES
// ============================================================================

// Logger HTTP moderne pour afficher les requêtes entrantes dans la console
app.use(morgan('dev'));

// EXERCICE 2 - Étape 4 : Middleware pour récupérer les données au format JSON
app.use(express.json());

// Middleware pour parser les requêtes encodées en URL (formulaires)
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// EXERCICE 4 - Étape 2 : Configuration du moteur de templates EJS
// ============================================================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================================================
// EXERCICE 2 - Étape 5 : Monter le routeur utilisateur avec le préfixe /api
// Les routes seront :
//   - GET  /api/users
//   - POST /api/users
// ============================================================================
app.use('/api', userRoutes);

// ============================================================================
// EXERCICE 5 : Affichage conditionnel d'une page avec EJS
// Route GET : /shop
// Condition : Si heure >= 8 et heure < 18 => open.ejs, sinon => close.ejs
// ============================================================================
app.get('/shop', (req, res) => {
    const now = new Date();

    // Permet la simulation d'heure via query string (ex: /shop?hour=10 ou /shop?hour=22)
    // Utile pour la soutenance ou pour tester sans changer l'heure de sa machine
    const simulatedHour = req.query.hour !== undefined ? parseInt(req.query.hour, 10) : null;
    const currentHour = simulatedHour !== null && !isNaN(simulatedHour) ? simulatedHour : now.getHours();
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeFormatted = `${String(currentHour).padStart(2, '0')}h${currentMinutes}`;

    // Condition du TP : Ouvert de 8h à 18h (donc de 8h00 inclus jusqu'à 17h59)
    const isOpen = currentHour >= 8 && currentHour < 18;

    if (isOpen) {
        // Calcul du temps restant avant fermeture
        const hoursLeft = 18 - currentHour - 1;
        const minutesLeft = 60 - now.getMinutes();
        const timeUntilClose = `${hoursLeft}h ${minutesLeft}m`;

        return res.render('open', {
            currentHour,
            currentTimeFormatted,
            timeUntilClose,
            isOpen: true
        });
    } else {
        // Prochaine ouverture
        const nextOpening = currentHour >= 18 ? 'Demain à 08h00' : "Aujourd'hui à 08h00";

        return res.render('close', {
            currentHour,
            currentTimeFormatted,
            nextOpening,
            isOpen: false
        });
    }
});

// ============================================================================
// PAGE D'ACCUEIL / DASHBOARD PRO
// Route GET : /
// Permet de tester directement le serveur, l'API et EJS depuis le navigateur
// ============================================================================
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TP N°8 - Express.js API & EJS Dashboard</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
            body { font-family: 'Plus Jakarta Sans', sans-serif; }
        </style>
    </head>
    <body class="bg-slate-950 text-slate-100 min-h-screen p-6 md:p-12">
        <div class="max-w-5xl mx-auto space-y-8">
            
            <!-- Hero Header -->
            <div class="bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
                            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>Serveur Express Actif sur le Port ${PORT}</span>
                        </div>
                        <h1 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                            TP N°8 — Backend Express.js & EJS
                        </h1>
                        <p class="text-slate-300 mt-2 text-sm md:text-base">
                            Architecture modulaire, gestion des requêtes GET/POST, middlewares JSON et templates dynamiques EJS.
                        </p>
                    </div>
                    <div class="flex flex-wrap gap-3">
                        <a href="/shop" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl transition flex items-center space-x-2 text-sm shadow-lg shadow-emerald-600/30">
                            <i class="fa-solid fa-store"></i>
                            <span>Accéder à /shop</span>
                        </a>
                        <a href="/api/users" target="_blank" class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-3 rounded-xl transition flex items-center space-x-2 text-sm shadow-lg shadow-indigo-600/30">
                            <i class="fa-solid fa-users"></i>
                            <span>Tester /api/users</span>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Grid: Routes Overview -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <!-- Partie 1 Card -->
                <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                            P1
                        </div>
                        <div>
                            <h2 class="font-bold text-lg text-white">Partie 1 : Routes & JSON</h2>
                            <p class="text-xs text-slate-400">Exercices 1, 2 & 3 (Express Router + req.body)</p>
                        </div>
                    </div>
                    
                    <div class="space-y-3 text-sm">
                        <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <span class="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-400">GET</span>
                                <code class="text-slate-300">/api/users</code>
                            </div>
                            <span class="text-xs text-slate-400">« Liste des utilisateurs »</span>
                        </div>
                        <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <span class="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400">POST</span>
                                <code class="text-slate-300">/api/users</code>
                            </div>
                            <span class="text-xs text-slate-400">req.body { name, email, age }</span>
                        </div>
                    </div>
                </div>

                <!-- Partie 2 Card -->
                <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                            P2
                        </div>
                        <div>
                            <h2 class="font-bold text-lg text-white">Partie 2 : Moteur EJS</h2>
                            <p class="text-xs text-slate-400">Exercices 4 & 5 (Affichage conditionnel 8h-18h)</p>
                        </div>
                    </div>
                    
                    <div class="space-y-3 text-sm">
                        <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <span class="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400">EJS</span>
                                <code class="text-slate-300">/shop</code>
                            </div>
                            <span class="text-xs text-emerald-400">open.ejs si 8h &lt; heure &lt; 18h</span>
                        </div>
                        <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <span class="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400">EJS</span>
                                <code class="text-slate-300">/shop</code>
                            </div>
                            <span class="text-xs text-rose-400">close.ejs en dehors</span>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Interactive API Tester (Pro Feature) -->
            <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                <h3 class="font-bold text-lg text-white mb-2 flex items-center space-x-2">
                    <i class="fa-solid fa-paper-plane text-indigo-400"></i>
                    <span>Testeur Interactif de Requête POST /api/users (req.body)</span>
                </h3>
                <p class="text-xs text-slate-400 mb-6">Testez directement la création d'un utilisateur sans ouvrir Postman !</p>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">Nom (name)</label>
                        <input id="post-name" type="text" value="Ahmed" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                    </div>
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">Email (email)</label>
                        <input id="post-email" type="email" value="ahmed@gmail.com" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                    </div>
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">Âge (age)</label>
                        <input id="post-age" type="number" value="22" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                    </div>
                </div>

                <div class="flex items-center space-x-3 mb-4">
                    <button onclick="sendUserPost()" class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition">
                        Envoyer POST /api/users
                    </button>
                    <button onclick="fetchUsersGet()" class="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2 rounded-lg text-sm border border-slate-700 transition">
                        Actualiser GET /api/users
                    </button>
                </div>

                <div class="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300">
                    <div class="text-slate-500 mb-2">// Console de réponse HTTP :</div>
                    <pre id="api-output" class="overflow-x-auto text-emerald-400">{ "status": "En attente d'une requête..." }</pre>
                </div>
            </div>

            <!-- Quick Simulator for EJS -->
            <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                <h3 class="font-bold text-lg text-white mb-2 flex items-center space-x-2">
                    <i class="fa-solid fa-clock text-amber-400"></i>
                    <span>Simulateur d'Heure pour EJS (/shop)</span>
                </h3>
                <p class="text-xs text-slate-400 mb-4">Changez virtuellement l'heure pour observer le basculement instantané entre open.ejs et close.ejs :</p>
                <div class="flex flex-wrap gap-3">
                    <a href="/shop" target="_blank" class="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2 rounded-lg border border-slate-700">
                        Heure Réelle du Système (Actuel)
                    </a>
                    <a href="/shop?hour=10" target="_blank" class="bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-300 text-xs px-4 py-2 rounded-lg border border-emerald-700/50">
                        Simuler 10h00 (Boutique Ouverte)
                    </a>
                    <a href="/shop?hour=14" target="_blank" class="bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-300 text-xs px-4 py-2 rounded-lg border border-emerald-700/50">
                        Simuler 14h00 (Boutique Ouverte)
                    </a>
                    <a href="/shop?hour=20" target="_blank" class="bg-rose-900/30 hover:bg-rose-900/50 text-rose-300 text-xs px-4 py-2 rounded-lg border border-rose-700/50">
                        Simuler 20h00 (Boutique Fermée)
                    </a>
                    <a href="/shop?hour=6" target="_blank" class="bg-rose-900/30 hover:bg-rose-900/50 text-rose-300 text-xs px-4 py-2 rounded-lg border border-rose-700/50">
                        Simuler 06h00 (Boutique Fermée)
                    </a>
                </div>
            </div>

        </div>

        <script>
            async function sendUserPost() {
                const name = document.getElementById('post-name').value;
                const email = document.getElementById('post-email').value;
                const age = document.getElementById('post-age').value;

                try {
                    const res = await fetch('/api/users', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, email, age })
                    });
                    const data = await res.json();
                    document.getElementById('api-output').textContent = JSON.stringify(data, null, 2);
                } catch (err) {
                    document.getElementById('api-output').textContent = 'Erreur: ' + err.message;
                }
            }

            async function fetchUsersGet() {
                try {
                    const res = await fetch('/api/users');
                    const data = await res.json();
                    document.getElementById('api-output').textContent = JSON.stringify(data, null, 2);
                } catch (err) {
                    document.getElementById('api-output').textContent = 'Erreur: ' + err.message;
                }
            }
        </script>
    </body>
    </html>
    `);
});

// ============================================================================
// GESTIONNAIRE D'ERREURS 404 (Route introuvable)
// ============================================================================
app.use((req, res) => {
    if (req.accepts('json')) {
        return res.status(404).json({
            success: false,
            message: `Route introuvable : ${req.method} ${req.originalUrl}`
        });
    }
    res.status(404).send('<h1>404 - Page non trouvée</h1>');
});

// ============================================================================
// GESTIONNAIRE D'ERREURS GLOBAL (500)
// ============================================================================
app.use((err, req, res, next) => {
    console.error('Erreur Serveur :', err.stack);
    res.status(500).json({
        success: false,
        message: 'Une erreur interne est survenue sur le serveur.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ============================================================================
// EXERCICE 1 - Étape 6 & 7 : Démarrer le serveur avec app.listen()
// et afficher un message clair dans la console
// ============================================================================
app.listen(PORT, () => {
    console.log(`\n=============================================================`);
    console.log(`🚀 Serveur Express démarré avec succès !`);
    console.log(`📍 Port : ${PORT}`);
    console.log(`🌐 Dashboard : http://localhost:${PORT}`);
    console.log(`🔗 API Users : http://localhost:${PORT}/api/users`);
    console.log(`🛍️  Boutique EJS : http://localhost:${PORT}/shop`);
    console.log(`=============================================================\n`);
});

module.exports = app;
