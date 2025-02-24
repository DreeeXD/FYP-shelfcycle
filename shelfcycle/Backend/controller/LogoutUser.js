async function LogoutUser(request, response){
    try{
        response.clearCookie('token');
        response.status(200).json({
            message : "Logged out successfully",
            error : false,
            success : true,
            data : []
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

module.exports = LogoutUser;