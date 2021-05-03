const express = require('express');
const users = require('../Models/users');
const authorize = require('../authorization');

const router = express.Router();

router.get('/', authorize, (req, res) => {
    users.find({ _id: req.user.id }, (err, result) => {
        if (err) {
            return res.status(500).json({
                status: 'error',
                error: err
            })
        }
        else {

            res.status(201).json(result);
        }
    })
})



module.exports = router;