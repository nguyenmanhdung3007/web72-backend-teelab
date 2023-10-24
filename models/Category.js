const mongoose = require('mongoose')

const Caterory = mongoose.Schema({
    name: {
        type: 'string',
        required: true
    },
    slug: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('categories', Caterory)