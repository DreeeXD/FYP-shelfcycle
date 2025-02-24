const jwt = require('jsonwebtoken');

async function authenticationToken(request, response, next){ 
    try{
        const token = request.cookies?.token

        if(!token){
            return response.status(200).json({
                message : "Please login.",
                error : true,
                success : false
            })
        }

        jwt.verify(token, process.env.Secret_Token_Key, function(error, decoded) {
            console.log(error)
            console.log("decoded", decoded) 

            // console.log("token   -", token)

            
            if(error){
                console.log("Authentication error:", error)
            }

            request.userID = decoded?._id
            next(); //passing it to the next controller

          });


        


        



    }catch (error){
        response.status(401).json({
            message: error.message || error,
            data : [],
            error: true,
            success: false 
        })

    }
}


module.exports = authenticationToken;