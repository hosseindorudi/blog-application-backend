const router = require("express").Router()
const Category = require("../models/Category")

//create
router.post("/", async(req, res) => {
    const newCategory = new Category(req.body)
    try {
        const savedCategory = await newCategory.save()
        return res.status(200).json(savedCategory)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

//get
router.get("/", async(req, res) => {
    try {
        const cats = await Category.find()
        return res.status(200).json(cats)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})



module.exports = router