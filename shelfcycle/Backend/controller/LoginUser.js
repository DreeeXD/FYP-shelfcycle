const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

async function LoginUserController(request, response) {
    try{

        const {email, password} = request.body


        if (!email){
            throw new Error('Please provide your email address')
        }

        if (!password){
            throw new Error('You need to provide your password')
        }

        const user = await userModel.findOne({email})
        if (!user){
            throw new Error('User not found. Please create a new account before logging in.')
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        console.log("Check Password", checkPassword)

        if (checkPassword) {
            const tokenPayload = {
              _id: user._id.toString(),
              email: user.email,
            };
          
              
            const token = jwt.sign(tokenPayload, process.env.Secret_Token_Key, { expiresIn: '8h' });
            const tokenOption = {
                httpOnly: true,
                secure: false, 
                sameSite: "Lax",
                maxAge: 8 * 60 * 60 * 1000, // 8 hours
              };

              console.log("Generated Token Payload:", tokenPayload);

            response.cookie("token", token, tokenOption).json({
                message: "Login successful",
                success: true,
                error: false,
                user: {
                  _id: user._id,
                  email: user.email,
                  username: user.username,
                }
              });



        }else{
            throw new Error('Incorrect password')
        }

    }
    catch(error){
        response.status(500).json({
            message : error.message,
            error : true,
            success : false
        })

    }
}

module.exports = LoginUserController;
