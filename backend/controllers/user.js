const User = require('../models/user')
const jwt = require('jsonwebtoken')

async function handleUserLogin(req,res){
    const {email, password} = req.body;

    try{
        if(!email || !password)  {
            return res.status(400).json({ message:"Required fields cannot be empty!" })
        }

        const user = await User.findOne({email,password});
        if(!user){
            return res.json({message: "Invalid credentials"})
        }
        // console.log("User: ", user)

        // generateCookie
        const token = jwt.sign({ id:user._id }, "password");
        res.cookie("userToken", token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000, 
        });

        return res.status(200).json(user);
    }
    catch(err){
        // console.log(err);
        return res.status(400).json({message: "Could not fetch dxata"})
    }
}

async function handleUserSignUp(req,res){
    const {name, email, password} = req.body;

    try{
        if(!name || !email || !password)  {
            return res.status(400).json({ message:"Required fields cannot be empty!" })
        }

        const user = await User.create({
            name,
            email,
            password
        });
        // console.log("user generated: ",user)
        
        const token = jwt.sign({ id:user._id }, "password");
        res.cookie("userToken", token);

        return res.status(200).json(user);
    }
    catch(err){
        return res.status(400).json({message: "Could not add user"});
    }
}

module.exports = {
    handleUserLogin,
    handleUserSignUp
}