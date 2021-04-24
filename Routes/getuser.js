const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const users = require('../Models/users');

const router = express.Router();

router.get('/', (req, res, next) => {
    users.find({}, (err, result) => {
        if (err) {
            return res.status(500).json({
                status: 'error',
                error: err
            })
        }
        else {
            console.log(result); 
            res.status(201).json(result[0].email);
        }
    })
})

module.exports = router;