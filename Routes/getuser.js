const express = require('express');
const users = require('../Models/users');
const authorize = require('../authorization');

const router = express.Router();

router.get('/', authorize, async (req, res) => {
    users.findOne({ _id: req.user.id })
        .exec()
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            return res.status(500).json({
                status: 'error',
                error: err
            })
        })
})


module.exports = router;