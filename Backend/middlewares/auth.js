import chalk from "chalk";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const auth = async (req, res, next) => {
    
    const token = req.cookies?.token;
    console.log("token: ",token);
    if(!token) {
        console.log(chalk.red("NO Token Found in Cookies"));
        return res.status(401).json({message:"NO Token Found in Cookies"});}
    
     
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        console.log("Decoded: ",decoded);
        const user = await User.findById({_id:decoded._id}).select("-password");

        if(!user) return res.status(401).json({message:"NO User Found"});

        req.user = user;

        console.log("req.user: ",req.user);

        console.log("currentUser: ",decoded);
        console.log(chalk.italic("User Authenticated"));
        next();
    }
    catch(errror){
        res.status(401).json({message:"NO Token Found"})
    }
}