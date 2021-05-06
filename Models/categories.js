const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    user_id: { type: mongoose.ObjectId, required: true },
    created_at: { type: String, required: true },
    updated_at: { type: String, required: false },
})

module.exports = mongoose.model('categories', categorySchema);