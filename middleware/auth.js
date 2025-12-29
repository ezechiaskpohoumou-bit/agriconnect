const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Pour l'instant, on laisse passer pour que ton site s'affiche
    next(); 
};
