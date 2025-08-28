import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const requireSignIn = (req, res, next) => {
    try {
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        console.log("request data is :-", req);
        console.log("response data is :-", res);
        req.user = decode;
        next();
    } catch (error) {
        res.status(401).send({
            success: false,
            message: "Unauthorized Access",
            error
        });
    }
}




export const isAdmin =  async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if(user.role !== 1){
            return res.status(403).send({
                success: false,
                message: "Unauthorized Access"
            });
        }else{
            next();
        }
    } catch (error) {
        console.log("error in catch block", error.response.data.message );
        res.status(500).send({
            success: false,
            message: "Error in Admin Middleware",
            error
        });
    }
}





















