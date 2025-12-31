const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Route pour créer une commande : POST /api/orders
router.post('/', async (req, res) => {
    try {
        const { acheteurId, items } = req.body; // items = [{produitId, quantite}, ...]

        let total = 0;
        const produitsCommandes = [];

        // Boucle pour calculer le prix total et vérifier les produits
        for (let item of items) {
            const produit = await Product.findById(item.produitId);
            if (!produit) return res.status(404).json({ message: "Produit non trouvé" });
            
            total += produit.prix * item.quantite;
            produitsCommandes.push({
                produit: produit._id,
                quantite: item.quantite,
                prixUnitaire: produit.prix
            });
        }

        const nouvelleCommande = new Order({
            acheteur: acheteurId,
            produits: produitsCommandes,
            montantTotal: total
        });

        await nouvelleCommande.save();

        // ICI : Plus tard, on ajoutera l'appel vers FedaPay/CinetPay pour obtenir le lien de paiement
        res.status(201).json({ 
            message: "Commande créée, en attente de paiement", 
            commandeId: nouvelleCommande._id,
            total: total 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
