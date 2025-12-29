const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Pour l'instant, on laisse passer pour vérifier que le serveur démarre
        next();
    } catch (error) {
        res.status(401).json({ message: 'Requête non authentifiée' });
    }
};
