const mongoose = require('mongoose');
require('dotenv').config();
const mongopass = process.env.MONGOPASS;
const mongoPath = `mongodb+srv://kali:${mongopass}@cluster0.jx4hq.mongodb.net/kalibot?retryWrites=true&w=majority`;
// Set up and initalize a connection with the MongoDB database which contains server specific info such as custom prefixes
module.exports = async() =>{
    await mongoose.connect(mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return mongoose;
}