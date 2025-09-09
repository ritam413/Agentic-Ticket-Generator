import User from "../models/user.model.js";
import { inngest } from "../ingest/client.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import chalk from 'chalk';

export const createSuperAdmin = async(req,res)=>{
    try{
        const {email,password,secretKey} = req.body;

        if(secretKey !== process.env.SUPERADMIN_SECRET_KEY) return res.status(400).json({error:"Invalid Secret Key"});

        const existing = await User.findOne({email});
        if(existing) return res.status(400).json({error:"Super Admin already exists"});

        const hashed = await bcrypt.hash(password,10);
        const superadmin = await User.create({
            email,
            password:hashed,
            role:"superadmin",
           
            skills:Array.isArray(skills)?skills:[]


        })

        res.status(201).json({
            message:"✅ Super Admin created successfully",
            user:{email:superadmin.email,role:superadmin.role}
        });

    }catch(error){
        res.status(500).json({error:"❌ Super Admin creation failed",details:error.message});
    }
} 

export const signup = async (req, res) => {
    console.log(req.body)
    const { email, password, skills = [] } = req.body

    try {

        const existing = await User.findOne({ email })
        if (existing) return res.status(400).json({ error: "User already exists" })

        const hashed = await bcrypt.hash(password, 10)

        const user = await User.create({
            email,
            role: "user",
            password: hashed,
            skills:Array.isArray(skills)?skills:[]
        })

        const userWithoutPassword = await User.findById(user._id).select(
            "-password"
        )
        // fire Ingest server

        await inngest.send({
            name: "user/signup",
            data: {
                email
            }
        })


        const token = jwt.sign(
            {
                _id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            },
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // only https in prod
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            user: userWithoutPassword,
            token
        })

        console.log(chalk.green("User created successfully"))
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) return res.status(404).json({ error: "User not found" })

        const isMatch = await bcrypt.compare(password, user.password)

        const userWithoutPassword = await User.findById(user._id).select(
            "-password"
        )

        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" })

        const token = jwt.sign(
            {
                _id: user._id,
                
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            },
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // only https in prod
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            message: "Login successful",
            user: userWithoutPassword,
            token
        })

        console.log(chalk.yellow("User logged in successfully: ",user.email))
    } catch (error) {
        res.status(500).json({ error: "Login Failed", details: error.message })
    }

};

export  const checkAuth = async (req,res)=>{
    try {
    const token = req.cookies?.token; // JWT stored in cookie

    if (!token) {
      return res.json({ user: null }); // Not authenticated
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in DB
    const user = await User.findById(decoded._id).select("-password"); // exclude password
    if (!user) {
      return res.json({ user: null });
    }

    // Return user info
    return res.json({ user });
  } catch (err) {
    console.error("Auth check failed:", err);
    return res.json({ user: null }); // Invalid token
  }
}


export const logout = async (req, res) => {
    try {
        const token = req.cookies.token
        console.log(token)
        if (!token) return res.status(401).json({ message: "User not logged in" });

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.status(401).json({ message: "User not logged in" });
            res.clearCookie("token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax"
            });
            res.json({ message: "Logout successful" })
        })
        console.log(chalk.hex("#D400E6")("✅ User logged out successfully"))
    } catch (error) {
        res.status(500).json({ error: "❌ Logout Failed", details: error.message })
    }
};

export const updateUser = async (req, res) => {
    const { skills = [], role, email } = req.body

    try {
        if (req.user?.role !== "admin" && req.user?.role !== "superadmin") return res.status(401).json({ message: "Not Allowed, you are not an admin" })

        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ message: "User not found" })

        await User.updateOne(
            { email },
            {
                skills: skills.length ? skills : user.skills, role
            }
        )

        return res.json({ message: "User updated successfully" })
    } catch (error) {
        res.status(500).json({ error: "Update Failed", details: error.message })
    }
}


export const getUser = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "superadmin") {
            console.log(chalk.hex("#E65D00")("NOt Allowed you are not an admin"))
            return res.status(401).json({ message: "Not Allowed, you are not an admin" });
        }

        const user = await User.find().select("-password")
        return res.json(user)
    } catch (error) {
        res.status(500).json({ error: "Get User Failed", details: error.message })
    }
}