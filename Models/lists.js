const mongoose = require('mongoose');


const listSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user_id: { type: String, required: true },
    created_at: { type: String, required: true },
    updated_at: { type: String, required: false },
})

module.exports = mongoose.model('lists', listSchema);