import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
    },
    username: {
        type: String,
        unique: true,
        sparse: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "moderator", "admin", "superadmin"],
        default: "user",
    },
    profilePicture: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    lastLogin: {
        type: Date,
    },
    ticketsCreated: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }
    ],
    ticketsAssigned: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }
    ],
    promptHistory: [
        {
            originalPrompt: String,
            refinedPrompt: String,
            createdAt: { type: Date, default: Date.now }
        }
    ],
    specialization: {
        type: String,
    },
    credits: {
        type: Number,
        default: 10, 
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
