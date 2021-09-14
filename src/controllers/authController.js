//imports stars
const express = require('express');

const bcryptjs = require('bcryptjs');

const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth.json');

const User = require('../models/users');

const router = express.Router();
//imports end

//token generat 
function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret,{
        expiresIn: 86400,
    })
}

//register user, not shows the password
router.post('/register', async (req, res) => {
    try {
        const user = await User.create(req.body);

        user.password = undefined;

        //return the use and his token
        return res.send({ 
            user,
            token: generateToken({ id: user.id})
        });
    }
    catch (err) {
        return res.status(400).send({ error: 'registration faild'})
    }    
});

//authenticate the user
router.post('/authenticate', async(req,res)=> {
    const{email, password} = req.body; 

    //search for the user and his password
    const user = await User.findOne({ email }).select('+password');

    //in case the user as wrong
    if(!user){
        return res.status(400).send({erro:'User not found'})
    }
    //in case tha password as wrong
    if(!await bcryptjs.compare(password, user.password)){
        return res.status(400).send({error:'invalid password'})
    }

    user.password = undefined;

    //return the use and his token
    res.send({
        user,
        token: generateToken({ id: user.id})
    });
})


module.exports = app => app.use('/auth', router);