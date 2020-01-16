const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, '@qwerty312', (err, decoded) => {
            if (err) {
                return res.status(404).json({
                    message: err.message || "Token expired"
                });
            } else {
                req.userData = decoded;
                next();
            }

        });

    } catch (error) {
        res.status(401).json({
            message: error.message || 'Authorization required for this action'
        });
    }

};