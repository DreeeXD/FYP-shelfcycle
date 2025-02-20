const mongoose = require('mongoose');

async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGODB_URI) //await because it is a
        // console.log('Connected to MongoDB successfully');
    }
    catch(error){
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}

module.exports = connectDB;