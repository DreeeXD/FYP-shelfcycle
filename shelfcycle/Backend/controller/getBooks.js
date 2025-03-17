const bookModel = require("../models/bookModel")

const getBooksController = async(request, response) =>{
    try{
        const getBooks = await bookModel.find().sort({createdAt: -1})

        response.status(200).json({
            data : getBooks,
            error : false,
            success : true
        })
    }
    catch(error){
        response.status(500).json({
            message : error.message,
            error : true,
            success : false
        })
} 
}

module.exports = getBooksController;