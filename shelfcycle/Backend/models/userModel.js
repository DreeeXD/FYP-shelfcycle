const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true
    },
    phone : String,
    password : String,
    uploadPic : String

}, {
    timestamps : true
})

const userModel = mongoose.model('User', userSchema)

module.exports = userModel