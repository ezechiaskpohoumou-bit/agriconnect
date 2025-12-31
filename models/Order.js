const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    acheteur: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    produits: [{
        produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        nom: String,
        prix: Number,
        quantite: { type: Number, default: 1 },
        prixUnitaire: Number
    }],
    montantTotal: { type: Number, required: true },
    transactionId: { type: String }, // L'identifiant donné par CinetPay/FedaPay
    statut: { 
        type: String, 
        enum: ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED'], 
        default: 'PENDING' 
    },
    paymentId: { type: String }, // ID de la transaction chez le partenaire (FedaPay, etc.)
    dateCommande: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
