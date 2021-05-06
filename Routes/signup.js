const express = require('express');
const user = require('../Models/users');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/', async (req, res) => {
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
                username: req.body.userName
            });
            newuser
                .save()
                .then(result => {
                    console.log(`${result.username} : Registered`);
                    res.status(201).json('Successful operation');
                })
                .catch(err => {
                    res.status(422).json({
                        status: 'error',
                        message: err
                    })
                })
        }
    });
});



module.exports = router;