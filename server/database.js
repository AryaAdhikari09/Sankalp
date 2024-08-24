require('dotenv').config()

let mongoose = require('mongoose')

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Database Connected Succesfully');
    } catch (err) {
        console.log("MongoDB Couldnt Connect: ", err);
    }
}

module.exports = connectDB