const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")


//register
router.post("/register", async(req, res) => {
    if(!req.body.username || !req.body.email || !req.body.password){
        return res.status(403).json("all inputs are required")
    }
    try {
        const salt = await bcrypt.genSalt(12)
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPassword,
        })
        const user = await newUser.save()
        return res.status(201).json(user)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

//login
router.post("/login", async (req, res) => {
    if(!req.body.username || !req.body.password){
        return res.status(403).json("all inputs are required")
    }
    try {
        const user = await User.findOne({
            username: req.body.username
        })
        if(!user) return res.status(400).json("Wrong credential!")

        const validate = await bcrypt.compare(req.body.password, user.password)

        if(!validate) return res.status(400).json("Wrong credential!")
        const {password, ...others} = user._doc
        return res.status(200).json(others)

    } catch (error) {
        return res.status(500).json(error.message)
    }
})

module.exports = router