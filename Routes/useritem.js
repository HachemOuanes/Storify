const express = require('express');
const authorize = require('../authorization');
const items = require('../Models/items');
const users = require('../Models/users');

const router = express.Router();
router.use(authorize);

router.post('/', async (req, res) => {
    const query = { _id: req.user.id };
    await users.findOne(query)
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
    const query = { user_id: req.user.id };
    await items.find(query)
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
    const query = { _id: req.params.id };
    const update = { name: req.body.name, category_id: req.body.category_id, note: req.body.note, image: req.body.image, updated_at: new Date() };
    const options = { upsert: true, useFindAndModify: false };
   await  lists.findOneAndUpdate(query, update, options)
    .exec()
    .then(item => {
        item
            .save()
            .then(newitem => {
                res.status(201).json(newitem);
                console.log(`${newitem.name} : Updated`);
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
    await items.findOneAndDelete(query)
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