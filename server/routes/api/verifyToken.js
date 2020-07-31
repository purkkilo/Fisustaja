const jwt = require('jsonwebtoken');

let secret = "";

if (process.env.NODE_ENV === "production") {
    secret = process.env.SECRET;
}
else {
    const config = require('./config.json');
    secret = config.secret;
}


//TODO implement this into app
// Dunno where to put this really, it should check the token when App.vue is mounted
module.exports = function auth (req, res, next) {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, secret);
        req.user = verified;
    }catch (err) {
        res.status(400).send('Invalid Token');
    }
}