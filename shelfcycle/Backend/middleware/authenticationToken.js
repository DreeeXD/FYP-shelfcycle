const jwt = require('jsonwebtoken');

async function authenticationToken(request, response, next){ 
    try{
        const token = request.cookies?.token

        jwt.verify(token, process.env.Secret_Token_Key, function(error, decoded) {
            console.log(error)
            console.log("decoded", decoded) 
          });

        // console.log("token   -", token)
        if(!token){
            return res.status(200).json({
                message : "Please login.",
                error : true,
                success : false
            })
        }


    }catch (error){
        response.status(400).json({
            message: error.message || error,
            data : [],
            error: true,
            success: false 
        })

    }
}


module.exports = authenticationToken;