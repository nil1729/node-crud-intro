const mongoose = require('mongoose');
const connectDB = async(db) => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('MongoDB connected');
    } catch (e) {
        console.log('Refused to Connect....');
    }
};

module.exports = connectDB;