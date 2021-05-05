const express = require('express');
const authorize = require('../authorization');
const categories = require('../Models/categories');
const users = require('../Models/users')

const router = express.Router();
router.use(authorize);

router.post('/', async (req, res) => {
    users.findOne({ _id: req.user.id })
        .exec()
        .then(user => {
            const newcategory = new categories({
                name: req.body.name,
                user_id: user._id,
                created_at: new Date()
            })
            newcategory
                .save()
                .then(category => {
                    res.status(201).json(category);
                    console.log(`${category.name} : Added`);
                })
                .catch(err => {
                    console.log(err);
                    res.status(422).json({
                        status: "error",
                        message: err
                    })
                })
        })
        .catch(err => {
            return res.status(500).json({
                status: 'error',
                error: err
            })
        })
})

router.get('/', async (req, res) => {
    categories.find({ user_id: req.user.id })
        .exec()
        .then(category => {
            res.status(201).json(category);
            console.log(`${req.user.username} : Accessed categories`);
        })
        .catch(err => {
            return res.status(500).json({
                status: 'error',
                message: err
            })
        })
})

router.put('/:id', async (req, res) => {
    categories.findOneAndUpdate(
        { _id: req.params.id },
        {
            name: req.body.name,
            updated_at: new Date()
        },
        {
            upsert: true,
            useFindAndModify: false
        })
        .exec()
        .then(category => {
            res.status(201).json(category);
            console.log(`${category.name} : Updated`);
        })
        .catch(err => {
            return res.status(500).json({
                status: 'error',
                message: err
            })
        })
})

router.delete('/:id', async (req, res) => {
    categories.findOneAndDelete({ _id: req.params.id })
        .exec()
        .then(category => {
            res.status(201).json('Successful operation');
            console.log(`${category.name} : Deleted`);
        })
        .catch(err => {
            return res.status(500).json({
                status: 'error',
                message: err
            })
        })
})

module.exports = router;