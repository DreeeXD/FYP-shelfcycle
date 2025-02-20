const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username : String,
    email : {
        type : String,
        required : true,
        unique : true
    },
    phone : String,
    password : String,
    uploadPic : String

}, {
    timestamps : true
})

const userModel = mongoose.model('User', userSchema)

module.exports = userModel