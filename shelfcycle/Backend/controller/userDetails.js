const userModel = require("../models/userModel");

async function userDetailsController (request, response){

    try{ 
        console.log("User ID", request.userID)
        const user = await userModel.findById(request.userID)

        response.status(200).json({
            data: user,
            error: false,
            success: true,
            message: "User details"
        })

        console.log("User", user)
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