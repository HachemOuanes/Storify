const express = require('express');
const mongoose = require('mongoose');
const users = require('../Models/users');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/', async (req, res) => {
    await users.find({ email: req.body.email })
        .exec()
        .then(async user => {
            if ((typeof user[0]) == 'undefined') {
                return res.status(400).json('User not found');
            }
            await bcrypt.compare(req.body.password, user[0].password)
                .then(result => {
                    if (result) {
                        res.status(201).json('Successful operation');
                        console.log(`${user[0].username} Logged in`);
                    }
                    else {
                        res.status(422).json('Validation Error');
                    }
                })
                .catch(err => {
                    res.status(403).json({
                        status: "error",
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



module.exports = router;