const express = require('express');
const authorize = require('../authorization');
const categories = require('../Models/categories');
const users = require('../Models/users')

const router = express.Router();
router.use(authorize);

router.post('/', async (req, res) => {
    const query = { _id: req.user.id };
    await users.findOne(query)
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
    const query = { user_id: req.user.id };
    await categories.find(query)
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
    const query = { _id: req.params.id };
    const update = { name: req.body.name, updated_at: new Date() };
    const options = { upsert: true, useFindAndModify: false };
    await lists.findOneAndUpdate(query, update, options)
        .exec()
        .then(category => {
            category
            .save()
            .then(newcategory => {
                res.status(201).json(newcategory);
                console.log(`${newcategory.name} : Updated`);
            })
            .catch(err => {
                res.status(422).json({
                    status: 'error',
                    message: err
                })
            })
        })
        .catch(err => {
            return res.status(500).json({
                status: 'error',
                message: err
            })
        })
})

router.delete('/:id', async (req, res) => {
    const query = { _id: req.params.id };
    await categories.findOneAndDelete(query)
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