const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('../Models/users');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/', async (req, res) => {
    await users.findOne({ email: req.body.email })
        .exec()
        .then(async user => {
            if (user == null) {
                return res.status(400).json({
                    status: 'error',
                    message: 'user not found'
                });
            }
            await bcrypt.compare(req.body.password, user.password)
                .then(result => {
                    if (result) {
                        const token = jwt.sign({
                            id: user._id,
                            username: user.username
                        },
                            process.env.ACCESS_SECRET);
                        res.status(201).json({
                            user,
                            accessToken: token
                        });
                        console.log(`${user.username} : Logged in`);

                    }
                    else {
                        res.status(422).json({
                            status: 'error',
                            message: 'invalid password'
                        });
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