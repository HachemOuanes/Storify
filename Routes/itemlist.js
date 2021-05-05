const express = require('express');
const authorize = require('../authorization');
const lists = require('../Models/lists');
const items = require('../Models/items');

const router = express.Router();
router.use(authorize);


const search = (req, res, next) => {
    items.findOne({ _id: req.body.item_id })
        .exec()
        .then(item => {
            if (item == null) {
                return res.status(400).json({
                    status: 'error',
                    message: 'item not found'
                });
            }
            req.requested_item = item;
            next();
        })
        .catch(err => {
            return res.status(500).json({
                status: 'error',
                error: err
            })
        })
}

router.post('/:id/items', search, (req, res) => {
    lists.findOne({ _id: req.body.list_id, user_id: req.user.id })
        .exec()
        .then(list => {
            // verify duplicates
            const item = req.requested_item;
            list.items.push(item);
            list
                .save()
                .then(modified_list => {
                    console.log(modified_list);
                    res.status(201).json(modified_list);
                    console.log(`${req.requested_item.name} : Added To : ${modified_list.name}`);
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
                error: err
            })
        })
})


router.get('/:id/items', (req, res) => {
    lists.findOne({ _id: req.params.id, user_id: req.user.id })
        .exec()
        .then(list => {
            res.status(201).json(list.items);
            console.log(`${req.user.username} : Accessed Items Of : ${list.name}`);
        })
        .catch(err => {
            return res.status(500).json({
                status: 'error',
                error: err
            })
        })
})

router.put('/:id/items', (req, res) => {

})

router.delete('/:id/items', (req, res) => {

})


module.exports = router;