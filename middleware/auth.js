const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Pour l'instant on simule une connexion pour que ton site s'affiche
        req.auth = { userId: "123" }; 
        next();
    } catch (error) {
        res.status(401).json({ message: 'Requête non authentifiée' });
    }
};
