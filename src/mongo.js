const mongoose = require('mongoose');
require('dotenv').config();
const mongopass = process.env.MONGOPASS;
const mongoPath = `mongodb+srv://kali:${mongopass}@cluster0.jx4hq.mongodb.net/kalibot?retryWrites=true&w=majority`;

module.exports = async() =>{
    await mongoose.connect(mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return mongoose;
}