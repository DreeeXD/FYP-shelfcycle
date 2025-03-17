const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
    bookTitle: String,
    bookAuthor: String,
    bookDescription: String,
    bookCondition: String,
    bookCategory: String,
    bookPrice: Number,
    bookImage: []
},{
    timestamps : true
})

const bookModel = mongoose.model('Book', bookSchema)

module.exports = bookModel