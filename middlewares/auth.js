const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send({ messsage: 'Access denied no token provided'});
    try{
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        if(decoded.isVerified) {
            req.user = decoded;
            next();
        }else{
            res.status(400).send({ messsage: 'User not verified'});
        }
    }catch(err){
        res.status(401).send({ messsage: 'Invalid token provided'});
    }
}