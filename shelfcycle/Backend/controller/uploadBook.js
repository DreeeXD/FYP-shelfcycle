const bookModel = require("../models/bookModel")

async function uploadBookController(request, response){
    try{
        const uploadBook = new bookModel(request.body)
        const saveProduct = await uploadBook.save()

        response.status(201).json({
            data: saveProduct,
            success: true,
            error: false,
            message: "Book uploaded successfully!"
        })
    }
    catch(error){
        response.status(400).json({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
}

module.exports = uploadBookController