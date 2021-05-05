const express = require('express');
const authorize = require('../authorization');
const items = require('../Models/items');
const users = require('../Models/users');

const router = express.Router();
router.use(authorize);

router.post('/', async (req, res) => {
    users.findOne({ _id: req.user.id })
        .exec()
        .then(user => {
            const newitem = new items({
                name: req.body.name,
                category_id: req.body.category_id,
                user_id: user._id,
                note: req.body.note,
                image: req.body.image,
                created_at: new Date()
            })
            newitem
                .save()
                .then(item => {
                    res.status(201).json(item);
                    console.log(`${item.name} : Added`);
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
    items.find({ user_id: req.user.id })
        .exec()
        .then(item => {
            res.status(201).json(item);
            console.log(`${req.user.username} : Accessed items`);
        })
        .catch(err => {
            return res.status(500).json({
                status: 'error',
                message: err
            })
        })
})

router.put('/:id', async (req, res) => {
    items.findOneAndUpdate(
        { _id: req.params.id },
        {
            name: req.body.name,
            category_id: req.body.category_id,
            note: req.body.note,
            image: req.body.image,
            updated_at: new Date(),
        },
        {
            upsert: false,
            useFindAndModify: false
        })
        .exec()
        .then(item => {
            res.status(201).json(item);
            console.log(`${item.name} : Updated`);
        })
        .catch(err => {
            return res.status(500).json({
                status: 'error',
                message: err
            })
        })
})

router.delete('/:id', async (req, res) => {
    items.findOneAndDelete({ _id: req.params.id })
        .exec()
        .then(item => {
            res.status(201).json('Successful operation');
            console.log(`${item.name} : Deleted`);
        })
        .catch(err => {
            return res.status(500).json({
                status: 'error',
                message: err
            })
        })
})

module.exports = router;