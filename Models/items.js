const mongoose = require('mongoose');


const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category_id: { type: String, required: true },
    user_id : { type: String, required: true },
    note : { type: String, required: false}, 
    image : { type: String, required: false},
    created_at: { type: String, required: true },
    updated_at: { type: String, required: false },
})

module.exports = mongoose.model('items', itemSchema);