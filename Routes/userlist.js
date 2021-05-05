const express = require('express');
const authorize = require('../authorization');
const lists = require('../Models/lists');
const users = require('../Models/users')

const router = express.Router();
router.use(authorize);

router.post('/', async (req, res) => {
    users.findOne({ _id: req.user.id })
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
    lists.find({ user_id: req.user.id })
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
    lists.findOneAndUpdate(
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
        .then(list => {
            res.status(201).json(list);
            console.log(`${list.name} : Updated`);
        })
        .catch(err => {
            return res.status(500).json({
                status: 'error',
                message: err
            })
        })
})

router.delete('/:id', async (req, res) => {
    lists.findOneAndDelete({ _id: req.params.id })
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



module.exports = router;