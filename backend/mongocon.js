const mongoose = require('mongoose');
require('dotenv').config();

const mongocon = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CONN_STRING);
        console.log('Connected to Mongo Successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = mongocon;