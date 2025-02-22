const userModel = require("../models/userModel")
const bcrypt = require('bcryptjs');
async function SignupUserController(request, response) {
    try{
        console.log("request.body", request.body)
        
        const { username, email, phone, password } = request.body

        
        const user = await userModel.findOne({email})
        console.log("user", user)

        if (user) {
            throw new Error("This email is already in use. Please try to log in")
        }


        if (!username){
            throw new Error('Please enter your username')
        }
        if (!email){
            throw new Error('Please provide your email address')
        }
        if (!phone){
            throw new Error('Please provide your phone number')
        }
        if (!password){
            throw new Error('You need to provide your password')
        }

        

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(password, salt); //its a promise so await

        if (!hashPassword){
            throw new Error('Password hashing failed')
        }

        const payload = {
            ...request.body,
            password: hashPassword
        }


        const userData = new userModel(payload);


        const saveUser = await userData.save()
        

        response.status(201).json({
            data: saveUser,
            success: true,
            error: false,
            message: "User profile successfully created!"
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

module.exports = SignupUserController;