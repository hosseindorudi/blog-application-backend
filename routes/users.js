const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")
const Post = require("../models/Post")

//Update
router.put("/:id", async(req, res) => {
    if(req.body.userId !== req.params.id) return res.status(401).json("you can only update your account") 
    try {
        const findUser = await User.findOne({_id: req.params.id})
        if(!findUser) return res.status(404).json("user dose not exist")
        if(req.body.password){
            const salt = await bcrypt.genSalt(12)
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        const {password, ...others} = updatedUser._doc
        return res.status(201).json(others)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

//Delete
router.delete("/:id", async(req, res) => {
    if(req.body.userId !== req.params.id) return res.status(401).json("you can only delete your account") 
    try {
        const findUser = await User.findById(req.params.id)
        if(!findUser) return res.status(404).json("user dose not exist")
        try {
            await Post.deleteMany({username: findUser.username})
            await User.findByIdAndDelete(req.params.id)
            return res.status(200).json("user has been deleted...")
        } catch (error) {
            return res.status(500).json(error.message)
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

//get a user
router.get("/:id", async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(200).json("user dose not exist")
        const {password, ...others} = user._doc
        return res.status(200).json(others)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

module.exports = router