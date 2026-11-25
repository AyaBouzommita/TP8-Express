/**
 * ============================================================================
 * Script de test automatisé pour le TP8 - Express.js
 * ============================================================================
 * Exécute l'ensemble des tests du TP sans dépendance externe (utilise fetch natif).
 * Permet de valider :
 *  - Exercice 1 : Démarrage du serveur et réponse HTTP 200 sur http://localhost:5000
 *  - Exercice 2 & 3 : GET /api/users et POST /api/users (req.body JSON)
 *  - Exercice 4 & 5 : Rendu EJS sur /shop (open.ejs et close.ejs)
 * ============================================================================
 */

const BASE_URL = 'http://localhost:5000';

async function runTests() {
    console.log('===========================================================');
    console.log('🧪 DÉBUT DES TESTS AUTOMATISÉS — TP N°8 EXPRESS.JS');
    console.log('===========================================================\n');

    let totalPassed = 0;
    let totalTests = 0;

    async function test(title, fn) {
        totalTests++;
        try {
            await fn();
            console.log(`✅ [SUCCÈS] ${title}`);
            totalPassed++;
        } catch (error) {
            console.error(`❌ [ÉCHEC]  ${title}`);
            console.error(`   Détail : ${error.message}\n`);
        }
    }

    // Test 1: Exercice 1 - Accès à la racine
    await test('Exercice 1 : Accès au serveur (GET /)', async () => {
        const res = await fetch(`${BASE_URL}/`);
        if (res.status !== 200) throw new Error(`Statut HTTP attendu: 200, reçu: ${res.status}`);
    });

    // Test 2: Exercice 2 & 3 - GET /api/users
    await test('Exercice 2 & 3 (Test 1) : GET /api/users retourne « Liste des utilisateurs »', async () => {
        const res = await fetch(`${BASE_URL}/api/users`);
        if (res.status !== 200) throw new Error(`Statut HTTP attendu: 200, reçu: ${res.status}`);
        const data = await res.json();
        if (!data.message || !data.message.includes('Liste des utilisateurs')) {
            throw new Error(`Message attendu contenant 'Liste des utilisateurs', reçu: ${JSON.stringify(data)}`);
        }
    });

    // Test 3: Exercice 2 & 3 - POST /api/users
    await test('Exercice 2 & 3 (Test 2) : POST /api/users récupère req.body (Ahmed, 22)', async () => {
        const payload = {
            name: "Ahmed",
            email: "ahmed@gmail.com",
            age: 22
        };

        const res = await fetch(`${BASE_URL}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.status !== 201 && res.status !== 200) {
            throw new Error(`Statut HTTP attendu: 201 ou 200, reçu: ${res.status}`);
        }

        const data = await res.json();
        const received = data.receivedData || data.user || data;

        if (received.name !== payload.name || received.email !== payload.email || Number(received.age) !== payload.age) {
            throw new Error(`Données renvoyées non conformes : ${JSON.stringify(data)}`);
        }
    });

    // Test 4: Validation Pro - POST /api/users avec données invalides
    await test('Extension Pro : POST /api/users rejette les données manquantes avec HTTP 400', async () => {
        const invalidPayload = { name: "" }; // sans email ni age

        const res = await fetch(`${BASE_URL}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(invalidPayload)
        });

        if (res.status !== 400) {
            throw new Error(`Statut HTTP attendu: 400 Bad Request, reçu: ${res.status}`);
        }
    });

    // Test 5: Exercice 5 - GET /shop (heure système)
    await test('Exercice 5 : GET /shop retourne une page HTML EJS valide', async () => {
        const res = await fetch(`${BASE_URL}/shop`);
        if (res.status !== 200) throw new Error(`Statut HTTP attendu: 200, reçu: ${res.status}`);
        const html = await res.text();
        const hasOpen = html.includes('Bienvenue ! Notre boutique est actuellement ouverte.');
        const hasClose = html.includes('Désolé, notre boutique est actuellement fermée.');
        if (!hasOpen && !hasClose) {
            throw new Error("La page retournée ne contient aucun des messages obligatoires du TP.");
        }
    });

    // Test 6: Exercice 5 - Simulation Heure Ouverte (10h)
    await test('Exercice 5 (Condition Ouvert) : /shop?hour=10 affiche open.ejs', async () => {
        const res = await fetch(`${BASE_URL}/shop?hour=10`);
        const html = await res.text();
        if (!html.includes('Bienvenue ! Notre boutique est actuellement ouverte.')) {
            throw new Error("Message de 'open.ejs' non trouvé à 10h.");
        }
    });

    // Test 7: Exercice 5 - Simulation Heure Fermée (22h)
    await test('Exercice 5 (Condition Fermé) : /shop?hour=22 affiche close.ejs', async () => {
        const res = await fetch(`${BASE_URL}/shop?hour=22`);
        const html = await res.text();
        if (!html.includes('Désolé, notre boutique est actuellement fermée.')) {
            throw new Error("Message de 'close.ejs' non trouvé à 22h.");
        }
    });

    console.log('\n===========================================================');
    console.log(`📊 RÉSULTAT FINAL : ${totalPassed} / ${totalTests} tests réussis (${Math.round((totalPassed / totalTests) * 100)}%)`);
    console.log('===========================================================\n');
}

runTests().catch(err => {
    console.error("Erreur critique d'exécution des tests :", err);
});
