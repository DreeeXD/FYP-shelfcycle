const userModel = require("../models/userModel")

async function updateUser(request, response){
    try{
        const {userId, email, username, phone} = request.body


        const payload = {
            ...(email && {email: email}),
            ...(username && {username: username}),
            ...(phone && {phone: phone})
            // ...(password && {password: password})
        }
        const updateUser = await userModel.findByIdAndUpdate(userId, payload)

        res.json({
            data: updateUser,
            message: "User updated successfully",
            success: true,
            error: false
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

module.exports = updateUser;