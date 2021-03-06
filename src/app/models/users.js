const mongoose = require('../../database');

const bcryptjs = require('bcryptjs')

//user infos
const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        unique: true,
        require: true,
        lowercase: true,
    },
    password:{
        type: String,
        riquere: true,
        selec: false,
    },
    passwordResetToken:{
        type: String,
        select: false
    },
    passwordResetExpires:{
        type: Date,
        select: false
    },
    createdat:{
        type: Date,
        default: Date.now,
    },
})

//incripeted the password
UserSchema.pre('save', async function(next){
    const hash = await bcryptjs.hash(this.password,10);
    this.password = hash;

    next();
})

const User = mongoose.model('User',UserSchema);

module.exports = User;