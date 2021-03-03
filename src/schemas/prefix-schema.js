const mongoose = require('mongoose');
const requiredString = {
    type: String,
    required: true
}
const prefixSchema = mongoose.Schema({
    _id: requiredString,
    prefix: requiredString
})

module.exports = mongoose.model('server-prefixes', prefixSchema);