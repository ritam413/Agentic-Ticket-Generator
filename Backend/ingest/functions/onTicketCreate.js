import { NonRetriableError } from "inngest"
import { inngest } from "../../ingest/client.js"
import Ticket from "../../models/ticket.model.js"
import User from "../../models/user.model.js"
import { sendMail } from "../../utils/mailer.js"
import analyseTicket from "../../utils/ai.js"

export const onTicketCreate = inngest.createFunction({

    id: 'onTicketCreate',
    name: 'onTicketCreate',
    handler: 'ingest/functions/onTicketCreate.js',
    retries: 2
},
    {
        event: "ticket/created"
    },
    async ({ event, step }) => {
        console.log("onTicketCreate triggered, event:", event.name, "ID:", event.data);
        try {
            const { ticketId } = event.data
            console.log("Ticket ID is:",ticketId)

            //fetch ticket from DB
            const ticket = await step.run("fetchTicket", async () => {
                const ticketObject = await Ticket.findById(ticketId)
                if (!ticketObject) {
                    throw new NonRetriableError("Ticket not found || Ticket dont Exist in our database")
                }
                return ticketObject
            })

            await step.run("UpdateTicketStatus", async () => {
                await Ticket.findByIdAndUpdate(ticketId, { status: "ToDo" })
            })

            const aiResponse = await analyseTicket(ticket)

            const relatedSkills = await step.run('ai-Processing', async () => {
                let skills = []

                if (aiResponse) {
                    await Ticket.findByIdAndUpdate(ticket._id, {
                        priority: !["low", "medium", "high"].includes(aiResponse.priority) ? "medium" : aiResponse.priority,
                        helpfullNotes: aiResponse.helpfullNotes || "",
                        status: "in-progress",
                        relatedSkills: aiResponse.relatedSkills || []
                    })
                    skills = aiResponse.relatedSkills || []
                }
                return skills
            })


            const moderator = await step.run("assignModerator", async () => {
                let user = await User.findOne({
                    role: "moderator",
                    skills: {
                        $elemMatch: {
                            $regex: relatedSkills.join("|"),
                            $options: "i"
                        }
                    }
                })
                console.log("User I got is: ",user)
                if (!user) {
                    user = await User.findOne({ role:"superadmin" })
                    console.log("User I got is: ",user)
                }
                const ticketId=ticket._id
                if(!ticketId){
                    console.error("❌ Ticket not found in DB for ID: ${ticketId}")
                    
                }

                await Ticket.findByIdAndUpdate(ticket._id, {
                    assignedTo: user?._id || null
                })

                return user;
            })

            await step.run("send-Email-Notification", async () => {
                if (moderator) {
                    const finalTicket = await Ticket.findById(ticket._id)
                    await sendMail(
                        moderator.email,
                        "New Ticket Assigned",
                        `A New Ticket is Assinged to You: ${finalTicket.title}`
                    )
                }
            })

            return { success: true }
        } catch (error) {
            console.log(`❌Error in onTicketCreate.js: ${error}`)

            return { success: false }
        }
    }
);