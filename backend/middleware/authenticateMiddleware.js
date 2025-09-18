const jwt = require('jsonwebtoken');

exports.verifyAdmin = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).send({ message: 'Authorization header missing' });
    }

    // Expected format: "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: 'Token missing from header' });
    }

    try {
        const tokenData = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
        if (tokenData.role !== 'ADMIN') {
            return res.status(403).send({ message: 'Access Denied: Not an admin' });
        }
        // Attach token data to the request for use in controllers if needed
        req.user = tokenData;
        next();
    } catch (error) {
        return res.status(403).send({ message: 'Invalid or expired token' });
    }
};