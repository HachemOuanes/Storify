const express = require('express');
const authorize = require('../authorization');
const lists = require('../Models/lists');
const users = require('../Models/users');
const itemlist = require('./itemlist');

const router = express.Router();
router.use(authorize);

router.post('/', async (req, res) => {
    const query = { _id: req.user.id };
    await users.findOne(query)
        .exec()
        .then(user => {
            const newlist = new lists({
                name: req.body.name,
                user_id: user._id,
                created_at: new Date()
            })
            newlist
                .save()
                .then(list => {
                    res.status(201).json(list);
                    console.log(`${list.name} : Added`);
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
    const query = { _id: req.user.id };
    await lists.find(query)
        .exec()
        .then(list => {
            res.status(201).json(list);
            console.log(`${req.user.username} : Accessed Lists`);
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
        .then(list => {
            list
                .save()
                .then(newlist => {
                    res.status(201).json(newlist);
                    console.log(`${newlist.name} : Updated`);
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
    const query = { _id: req.user.id };
    await lists.findOneAndDelete(query)
        .exec()
        .then(list => {
            res.status(201).json('Successful operation');
            console.log(`${list.name} : Deleted`);
        })
        .catch(err => {
            return res.status(500).json({
                status: 'error',
                message: err
            })
        })
})

router.use('/', itemlist);


module.exports = router;