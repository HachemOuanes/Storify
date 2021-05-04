const express = require('express');
const authorize = require('../../authorization');
const lists = require('../../Models/lists');
const users = require('../../Models/users')

const router = express.Router();

router.post('/', authorize, (req, res) => {
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
                    console.log(`${list.name} : Added`);
                    res.status(201).json(list);
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

router.get('/', authorize, (req, res) => {
    lists.findOne({ user_id: req.user.id })
        .exec()
        .then(list => {
            res.status(201).json(list);
            console.log(`${list.name} : Accessed`)
        })
        .catch(err => {
            return res.status(500).json({
                status: 'error',
                message: err
            })
        })
})

router.put('/:id', authorize, (req, res) => {
    lists.findOneAndUpdate({ _id: req.params.id }, { name: req.body.name, updated_at: new Date() }, { upsert: true, useFindAndModify : false})
        .exec()
        .then(list => {
            console.log(`${list.name} : Updated`)
            res.status(201).json(list); 
        })
        .catch(err => {
            return res.status(500).json({
                status: 'error',
                message: err
            })
        })
})


router.delete('/:id', authorize, (req, res) => {
    lists.findOneAndDelete({ _id: req.params.id })
        .exec()
        .then(list => {
            console.log(`${list.name} : Deleted`);
            res.status(201).json('Successful operation'); 
        })
        .catch(err => {
            return res.status(500).json({
                status: 'error',
                message: err
            })
        })
})

module.exports = router;