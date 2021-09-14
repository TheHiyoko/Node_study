//imports stars
const express = require('express');

const bcryptjs = require('bcryptjs');

const jwt = require('jsonwebtoken');

const authConfig = require('../../config/auth.json');

const User = require('../models/users');

const crypto = require('crypto');

const mailer = require('../../module/mailer');

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

//send email to reset password (don't work)
router.post('/forgot_passsword', async (req,res) => {
    const {email} = req.body;

    //try to gets the user email
    try{
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).send({error: 'User not found'})
        }
        //create a rondom token
        const token = crypto.randomBytes(20).toString('hex');
        //cachs the time
        const now = new Date();
        now.setHours(now.getHours+1);

        
        await User.findByIdAndUpdate(user.id, {
            'set$':{
            passwordResetToken: token,
            passwordResetExpires: now,
            }
        });
        //sand the email (don't work)
        mailer.sendMail({
            to: email,
            from: 'caio.demoraisfpinto@trollmail.com',
            template: '/src/resource/ath/forgotpasswrord.html',
            context: {token},
        }, (err) =>{
            if(err){
                return res.status(400).send({erro: 'cannot sen forgot passsword email'})
            } return res.status();
        } )

    } catch(err){
        res.status(400).send({erro: 'failded'})
    }
})
//reset password 
router.post('/reset_password', async(req,res)=> {
    const {email, token, password} = req.body;

    try{
        
        const user = await User.findOne({ email })
            .select('+passowordResetToken passowrdResetExpires');
        
            if(!user){
                return res.status(400).send({error: 'User not found'})
            }

            if(token !==   user.passwordResetToken){
                return res.status(400).send({error: 'Token invalid'})
            }

            const now = new Date();

            if(now > user.passwordResetExpires){
                return res.status(400).send({error: 'Token invalid, get a new one'})
            }

            user.password = password;

            await user.save();

            res.send

    } catch(err){
        res.status(400).send({error: 'Cannot reset password, try again'})
    }
})

module.exports = app => app.use('/auth', router);