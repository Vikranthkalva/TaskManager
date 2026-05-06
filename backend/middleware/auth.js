const jwt = require('jsonwebtoken');

// 1. Verify User is Logged In
exports.authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Please login" });
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (e) { res.status(401).json({ error: "Session expired" }); }
};

// 2. RBAC: Only ADMIN can perform specific actions
exports.authorize = (role) => (req, res, next) => {
    if (req.user.role !== role) return res.status(403).json({ error: "Admin access required" });
    next();
};