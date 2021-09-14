//import start
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth.json');
//import ends

//check the token
module.exports = (req,res,next)=>{
    const authHeader = req.headers.authorization;

    //first check
    if(!authHeader){
        return res.status(401).send({error: 'no token provided'});
    }
    const parts = authHeader.split(' ');

    //second check (don't really works)
    if(!parts.lenght === 2){
        return res.status(401).send({error: 'token error'});
    }

    const [scheme,token] = parts;

    //third check
    if(!/^Bearer$/i.test(scheme)){
        return res.status(401).send({error: 'token malformatted '});
    }

    //fourth check
    jwt.verify(token, authConfig.secret,(err, decoded)=>{
        if(err){
            return res.status(401).send({ error: 'Token invalid'})
        };

        //all valided
        req.userId = decoded.id;
        return next();
    })
    
};