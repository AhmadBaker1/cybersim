import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // We want to check if the token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // Extract token from header
    const token = authHeader.split(' ')[1];

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next(); //  Call the next middleware or route
    } catch (err) {
        console.error('Invalid token:', err);
        res.status(401).json({ error: 'Unauthorized' });
    }
};

export default authMiddleware;
/* In the authMiddleware.js file, we have a middleware function 
that checks if the request has a valid JWT token in the Authorization header. 
If the token is valid, it decodes the token and attaches the userId to the 
request object. If the token is invalid or missing, it returns an error response.*/