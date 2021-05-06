const express = require('express');
const mongoose = require('mongoose');
const authorize = require('../authorization');
const lists = require('../Models/lists');
const items = require('../Models/items');

const router = express.Router();
router.use(authorize);


const search = async (req, res, next) => {
    const query = { _id: req.body.item_id };
    await items.findOne(query)
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

router.post('/:id/items', search, async (req, res) => {
    const query = { _id: req.body.list_id, user_id: req.user.id };
    await lists.findOne(query)
        .exec()
        .then(list => {
            // TODO : verify duplicates
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


router.get('/:id/items', async (req, res) => {
    const query = { _id: req.params.id, user_id: req.user.id };
    await lists.findOne(query)
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

router.put('/:id/items', async (req, res) => {
    let id = mongoose.Types.ObjectId(req.body.item_id);
    const query = { _id: req.params.id, user_id: req.user.id };
    const update = { $set: { 'items.$[elem].name': req.body.name } };
    const options = { new: true, arrayFilters: [{ 'elem._id': id }], upsert: true, useFindAndModify: false };
    await lists.findOneAndUpdate(query, update, options)
        .exec()
        .then(list => {
            list
                .save()
                .then(newlist => {
                    res.status(201).json(newlist);
                    console.log(`${newlist.name} : Updated`);
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
                message: err
            })
        })
})


router.delete('/:id/items', async (req, res) => {
    let id = mongoose.Types.ObjectId(req.body.item_id);
    const query = { _id: req.params.id, user_id: req.user.id };
    const update = { $pull: { items: {_id: id} } };
    const options = {upsert: true, useFindAndModify: false };
    await lists.findOneAndUpdate(query, update, options)
        .exec()
        .then(list => {
            list
                .save()
                .then(newlist => {
                    res.status(201).json('Successful operation');
                    console.log(`${newlist.name} item : Deleted`);
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
                message: err
            })
        })
})


module.exports = router;