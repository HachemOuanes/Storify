const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const user = require('../Models/users');
const bcrypt = require('bcrypt');

router.post('/', async (req, res, next) => {
    await bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: err
            })
        }
        else {
            const newuser = new user({
                email: req.body.email,
                password: hash,
                username: req.body.username
            });
            console.log(newuser);
            // newuser
            //     .save()
            //     .then(result => {
            //         console.log(result);
            //         res.status(201).json('successful operation');
            //     })
            //     .catch(err => {
            //         console.log(err);
            //         res.status(403).json({
            //             status: "error",
            //             message: err
            //         })
            //     })
        }
    });
});



module.exports = router;