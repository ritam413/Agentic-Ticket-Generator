import Ticket from "../models/ticket.model.js"
import User from "../models/user.model.js"
import {inngest} from "../ingest/client.js"
import {processTicketWithAI} from "../utils/processTicketWithAI.js"
export const createTicket = async (req,res)=>{
    try {
        const {title,description} = req.body

        if(!title||!description) return res.status(400).json({message:"Title and description are required"});

        const newTicket = await Ticket.create({
            title,
            description,
            createdBy:req.user._id.toString(),
            status:"in-progress"
        })

        let relatedSkills = []

        try{
            relatedSkills = await processTicketWithAI(newTicket._id)
            console.error("Processed ticket with AI")
        }catch(err){
            console.error("Error processing ticket with AI",err)
            console.error("Error processing ticket with AI",err)
        }

        await inngest.send({
            name:"ticket/created",
            data:{
                ticketId: ( newTicket)._id.toString(),
                title,
                description,
                createdBy: req.user._id.toString()
            }
        })

        return res.status(201).json({message:"Ticket created successfully",
            success:true,
            ticket:newTicket,
            relatedSkills
        },
            
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

    // Base query: regular users can only access their own tickets
    let query = { _id: req.params.id };
    if (user.role === "user") {
      query.createdBy = user._id;
    }

    // Fetch ticket and populate assigned user
    const ticket = await Ticket.findOne(query).populate("assignedTo", ["email", "_id"]);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Return all relevant metadata
    return res.status(200).json({
      ticket: {
        _id: ticket._id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        relatedSkills: ticket.relatedSkills || [],
        helpfulNotes: ticket.helpfulNotes || "",
        assignedTo: ticket.assignedTo || null,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt
      },
    });
  } catch (error) {
    console.error("Error Fetching Ticket:", error);
    return res.status(400).json({ message: "Error Fetching Ticket" });
  }
}
// export const getTicket = async (req,res)=>{
//     try {
//         const user = req.user;
//         let ticket;
//         if(user.role !== "user"){
//             ticket =await Ticket.findById(req.params.id).populate("assignedTo",["email","_id"])
//         }else{
//             ticket =await Ticket.findOne({
//                 createdBy:user._id,
//                 _id:req.params.id
//             }).select("title description status priority relatedSkills helpfulNotes createdAt assignedTo")
//         }

//         if(!ticket){
//            return  res.status(404).json({message:"Ticket not found"})
//         }

//         return res.status(200).json({ticket})
//     } catch (error) {
//         console.log("Error Fetching Ticket",error)
//         res.status(400).json({message:"Error Fetching Ticket"})     
//     }
// }