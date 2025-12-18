const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
    const token = req.cookies.userToken;
    if (!token) {
        return res.json({ error: "Unauthorized access" });
    }

    try {
        const user = jwt.verify(token, "password");
        req.user = user;
        next();
    } catch (error) {
        return res.json({ error: "Invalid or expired token" });
    }
}

module.exports = { checkAuth };
