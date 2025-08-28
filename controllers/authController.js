import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from './../helpers/authHelper.js';
import JWT from 'jsonwebtoken';


export const registerController = async (req, res) => {
    try {
        const {name, email, password, phone, address, answer} = req.body;

        if(!name || !email || !password || !phone || !address || !answer){
            res.send({message: "All Field are Required"});
        }

        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(200).send({
                success: false,
                message: "Already Registered Please Login"
            })
        }

        const hashedPassword = await hashPassword(password);
        const user = await new userModel({name, email, phone, address, password: hashedPassword, answer}).save();
        res.status(201).send({
            success: true,
            message: "User Registered Successfully",
            user
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in Registration",
            success : false,
            error
        })
    }
}






export const loginController = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(404).send({
                message: "Invalid Email or Password",
                success: false
            })
        }

        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                message: "Email is not registered",
                success: false
            })
        }

        const match = await comparePassword(password, user.password);
        
        if(!match){
            return res.status(200).send({
                message: "Invalid Password",
                success: false
            })
        }

        const token = await JWT.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.status(200).send({
            success: true,
            message: "Login Successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token: token
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in Login",
            success : false,
            error
        })
    }
}





// forgot password controller

export const forgotPasswordController = async (req, res) => {
    try {
        const {email, answer, newPassword} = req.body;

        if(!email || !answer || !newPassword){
            return res.status(404).send({
                message: "All Fields are Required",
                success: false
            })
        }

        const user = await userModel.findOne({email, answer});
        if(!user){
            return res.status(404).send({
                message: "Wrong Credentials",
                success: false
            })
        }

        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, {password: hashed});
        
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in Resetting Password",
            success : false,
            error
        })
    }
};