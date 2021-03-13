const mongoose = require('mongoose');
const requiredString = {
    type: String,
    required: true
}
const settingsSchema = mongoose.Schema({
    _id: requiredString,
    prefix: requiredString,
    isLogsEnabled: requiredString,
    logsChannel: requiredString,
})

module.exports = mongoose.model('server-settings', settingsSchema);