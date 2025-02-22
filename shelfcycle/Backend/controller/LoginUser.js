const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

async function LoginUserController(request, response) {
    try{

        const { email, password} = request.body


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

        if (checkPassword){
            const tokenData = {
                _id : user._id,
                email: user._email
            }

            const token = await jwt.sign(tokenData, process.env.Secret_Token_Key, { expiresIn: '5h' });
            const tokenOption = {
                httpOnly: true,
                secure: true
            }

            response.cookie("token", token, tokenOption).json({
                message: "Login successful",
                data: token,
                success: true,
                error: false
            })



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
