const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from the `x-auth-token` header or `Authorization` header
    let token = req.header('x-auth-token');

    // Check the Authorization header if `x-auth-token` isn't present
    if (!token && req.header('Authorization')) {
        const authHeader = req.header('Authorization');
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.slice(7, authHeader.length).trim();
        }
    }

    // If no token is found, deny access
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
