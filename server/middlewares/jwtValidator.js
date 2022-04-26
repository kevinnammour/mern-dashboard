const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtValidator = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    if(!authorizationHeader) 
        return res.sendStatus(401);
    const token = authorizationHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) return res.sendStatus(403);
            req.useriD = decoded.userId;
            req.role = decoded.role;
            next();
        }
    )
}

module.exports = jwtValidator;