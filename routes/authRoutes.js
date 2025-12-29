const express = require('express');
const router = express.Router();
const User = require('../models/User'); // On importe notre plan de construction
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Route pour l'inscription : POST http://localhost:4000/api/auth/register
router.post('/register', async (req, res) => {
    try {
        // 1. On récupère les données envoyées par l'utilisateur
        const { nom, email, motDePasse, role, adresse } = req.body;

        // 2. On crée un nouvel utilisateur avec ces données
        const nouvelUtilisateur = new User({
            nom,
            email,
            motDePasse,
            role,
            adresse
        });

        // 3. On enregistre dans MongoDB
        await nouvelUtilisateur.save();

        // 4. On répond au client que ça a marché !
        res.status(201).json({ 
            message: "Utilisateur créé avec succès !",
            utilisateur: { nom, email, role } 
        });

    } catch (error) {
        // En cas d'erreur (ex: email déjà utilisé)
        res.status(400).json({ message: "Erreur lors de l'inscription", erreur: error.message });
    }
});

// Route de Connexion : POST http://localhost:4000/api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, motDePasse } = req.body;

        // 1. Chercher l'utilisateur par son email
        const utilisateur = await User.findOne({ email });
        if (!utilisateur) {
            return res.status(400).json({ erreur: "Utilisateur non trouvé" });
        }

        // 2. Vérifier si le mot de passe est correct
        const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
        if (!motDePasseValide) {
            return res.status(400).json({ erreur: "Mot de passe incorrect" });
        }

        // 3. Créer le "Badge" (Token)
        const token = jwt.sign(
            { id: utilisateur._id, role: utilisateur.role },
            "NOTRE_CLE_SECRETE_TRES_LONGUE", // On sécurisera ça plus tard
            { expiresIn: '24h' }
        );

        res.json({ 
            message: "Connexion réussie !", 
            token: token, 
            utilisateur: { nom: utilisateur.nom, role: utilisateur.role, id: utilisateur._id } 
        });

    } catch (error) {
        res.status(500).json({ erreur: error.message });
    }
});

module.exports = router;
