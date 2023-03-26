const router = require("express").Router()
const Post = require("../models/Post")

//create
router.post("/", async(req, res) => {
    const newpost = new Post(req.body)
    try {
        const savedPost = await newpost.save()
        return res.status(200).json(savedPost)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})


//Update
router.put("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post) return res.status(404).json("post dose not exist!")
        if(post.username !== req.body.username) {
        try {
            const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
                $set: req.body
            },{ new: true })
            return res.status(200).json(updatedPost)
        } catch (error) {
            return res.status(500).json(error.message)
        }}else {
            return res.status(401).json("you can only update your post") 
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

//Delete
router.delete("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post) return res.status(404).json("post dose not exist!")
        if(post.username !== req.body.username) {
        try {
            await post.deleteOne()
            return res.status(200).json("post has been deleted!")
        } catch (error) {
            return res.status(500).json(error.message)
        }}else {
            return res.status(401).json("you can only delete your post") 
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

//get a post
router.get("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(200).json("post dose not exist")
        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

//get all posts
router.get("/", async(req, res) => {
    const username = req.query.user;
    const catname = req.query.cat;
    try {
        let posts;
        if(username){
            posts = await Post.find({username})
        }else if (catname){
            posts = await Post.find({categories: {
                $in: [catname]
            }})
        }else {
            posts = await Post.find()
        }
        return res.status(200).json(posts)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

module.exports = router