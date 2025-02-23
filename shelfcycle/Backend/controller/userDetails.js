async function userDetailsController (request, response){

    try{

    }
    catch(error){
        response.status(400).json({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
}

module.exports = userDetailsController;