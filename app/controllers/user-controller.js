const User = require("../models/user-model")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')
const pick = require("lodash/pick")
const validator = require("validator")

const userCltr = {}

userCltr.register = async (req, res) => {
    try {
        const body = pick(req.body, ["username", "email", "password"])
        if(Object.keys(body).length === 0) {
            return res.status(404).json({error: "data fields not found"})
        }
        if(!body.email || !body.username || !body.password ){
            return res.status(400).json({error: "invalid data values"})
        }
        if(!validator.isEmail(body.email)) {
            return res.status(400).json({error: "invalid email"})
        }
        if(!body.password.length > 8) {
            return res.status(400).json({error: "password should be alteast 8 char long"})
        }
        if(!validator.isStrongPassword(body.password)) {
            return res.status(400).json({error: "password is not strong enough"})
        }
        const user = new User(body)
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(user.password, salt)
        user.password = hashedPassword
        const userDoc = await user.save()
        res.json(userDoc)
    } catch(e) {
        res.json(e)
    }
}

userCltr.login = async (req, res) => {
    try {
        const body = pick(req.body, ["email", "password"])
        if(Object.keys(body).length === 0) {
            return res.status(404).json({error: "data fields not found"})
        }
        if(!body.email || !body.password ){
            return res.status(400).json({error: "invalid data values"})
        }
        
        const user = await User.findOne({email: body.email})
        if(!user) {
            return res.status(404).json({error: "user not found"})
        } else {
            const password = await bcrypt.compare(body.password, user.password)
            if(!password) {
                res.status(400).json({error: "Incorrect password"})    
            } else {
                const tokenData = {
                    id: user._id
                } 
                const token = jwt.sign(tokenData, process.env.JWT_SECRET)
                res.json({
                    token:`bearer ${token}`
                })
            }
        }
    } catch(e) {
        res.json(e)
    }
}

userCltr.users = async (req, res) => {
    try {
        const user = await User.find({})
        res.json(user)
    } catch(e) {
        res.json(e)
    }
} 

module.exports = userCltr