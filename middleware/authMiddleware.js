/**
 * @file authMiddleware.js
 * @description Provides authentication and authorization middlewares using JWT.
 * Ensures that API endpoints are secured and accessed only by valid users/roles.
 */

const jwt = require('jsonwebtoken');

/**
 * @middleware verifyToken
 * @description Extracts the JWT from the Authorization header, verifies its validity,
 * and attaches the decoded payload (user details) to the request object.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const verifyToken = (req, res, next) => {
    // 1. Extract the Authorization header
    const authHeader = req.headers['authorization'];
    
    // 2. Expecting format: "Bearer <token>". Extract just the token string.
    const token = authHeader && authHeader.split(' ')[1]; 

    // 3. Reject if no token is provided
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Authentication failed. No token provided.' 
        });
    }

    try {
        // 4. Verify token using the secret key from environment variables
        // This will throw an error if the token is invalid, tampered with, or expired
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
        
        // 5. Attach the decoded payload (e.g., userId, role, username) to the request object
        // This makes the user data available to downstream middlewares and controllers
        req.user = decodedPayload; 
        
        // 6. Proceed to the next middleware or route handler
        next(); 
    } catch (error) {
        // 7. Handle token verification failure
        console.error('[Auth Middleware Error]:', error.message);
        
        // Differentiate between expired token and invalid token for better client feedback
        if (error.name === 'TokenExpiredError') {
             return res.status(401).json({ 
                success: false, 
                message: 'Session expired. Please log in again.' 
            });
        }

        return res.status(403).json({ 
            success: false, 
            message: 'Invalid token. Access forbidden.' 
        });
    }
};

/**
 * @middleware verifyAdmin
 * @description Checks if the authenticated user has 'Admin' privileges.
 * IMPORTANT: This must be placed AFTER the `verifyToken` middleware in the route definition.
 * @param {Object} req - Express request object (must contain req.user from verifyToken)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const verifyAdmin = (req, res, next) => {
    // 1. Verify that the user object exists (defensive check) and role is 'Admin'
    if (req.user && req.user.role === 'Admin') {
        // 2. Role matches, allow access
        next(); 
    } else {
        // 3. User is authenticated but lacks required privileges
        return res.status(403).json({ 
            success: false, 
            message: 'Authorization failed. Admin privileges are required to perform this action.' 
        });
    }
};

module.exports = {
    verifyToken,
    verifyAdmin
};