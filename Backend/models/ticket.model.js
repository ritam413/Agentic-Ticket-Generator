import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // short headline
    },
    description: {
        type: String,
        required: true, // user’s raw problem statement / original prompt
    },
    refinedPrompt: {
        type: String, // AI/Agent improved version of description
    },
    status: {
        type: String,
        enum: ["open", "in-progress", "resolved", "closed"],
        default: "open",
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high", "urgent"],
        default: "medium",
    },
    category: {
        type: String, // e.g. "technical", "billing", "sales", "support"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true, // customer who created it
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // agent working on it
    },
    deadline:{
        type:String,
        
    },
    aiHistory: [
        {
            originalPrompt: String,
            refinedPrompt: String,
            refinedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // which agent refined
            createdAt: { type: Date, default: Date.now },
        }
    ],
    attachments: [
        {
            url: String,
            type: { type: String }, // "image", "pdf", "doc", etc.
        }
    ],
    comments: [
        {
            author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            text: String,
            createdAt: { type: Date, default: Date.now },
        }
    ],
}, { timestamps: true });

export default mongoose.model("Ticket", ticketSchema);
 