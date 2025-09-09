import Ticket from "../models/ticket.model.js"
import User from "../models/user.model.js"
import {inngest} from "../ingest/client.js"
export const createTicket = async (req,res)=>{
    try {
        const {title,description} = req.body

        if(!title||!description) return res.status(400).json({message:"Title and description are required"});

        const newTicket = await Ticket.create({
            title,
            description,
            createdBy:req.user._id.toString()
        })

        await inngest.send({
            name:"ticket/created",
            data:{
                ticketId: ( newTicket)._id.toString(),
                title,
                description,
                createdBy: req.user._id.toString()
            }
        })

        return res.status(201).json({message:"Ticket created successfully"},
            
        )
        
    } catch (error) {
        console.error("Error Creating Ticket",error)
        return res.status(400).json({message:"Error Creating Ticket"})
    }
}

export const getTickets = async (req,res)=>{
    try {
        const user = req.user
        let tickets = []
        if(user.role !== "user"){
            tickets = await Ticket.find({})
            .populate("assignedTo",["email","_id"])
            .sort({createdAt:-1})
        }else{
            tickets = await  Ticket.find({createdBy:user._id})
            .select("title description status createdAt")
            .sort({createdAt:-1})
        }

        return res.status(200).json(tickets)
    } catch (error) {
        console.error("Error Fetching Tickets",error)
        return res.status(400).json({message:"Error Fetching Tickets"})
    }
}

export const getTicket = async (req,res)=>{
    try {
        const user = req.user;
        let ticket;
        if(user.role !== "user"){
            ticket = Ticket.findById(req.params.id).populate("assignedTo",["email","_id"])
        }else{
            ticket = Ticket.findOne({
                createdBy:user._id,
                _id:req.params.id
            }).select("title description status createdAt")
        }

        if(!ticket){
            res.status(404).json({message:"Ticket not found"})
        }
    } catch (error) {
        console.log("Error Fetching Ticket",error)
        res.status(400).json({message:"Error Fetching Ticket"})     
    }
}