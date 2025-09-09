import Ticket from "../models/ticket.model.js";
import analyseTicket from "../utils/ai.js"; // your AI function

export const processTicketWithAI = async (ticketId) => {
  try {
    // 1️⃣ Fetch the ticket from DB
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new Error("Ticket not found");

    // 2️⃣ Run AI analysis
    const aiData = await analyseTicket(ticket);
    if (!aiData) throw new Error("AI analysis failed");

    // 3️⃣ Update ticket fields from AI output
    ticket.priority = aiData.priority || ticket.priority;
    ticket.relatedSkills = aiData.relatedSkills || ticket.relatedSkills;
    ticket.helpfulNotes = aiData.helpfulNotes || ticket.helpfulNotes;
    ticket.category = aiData.category || ticket.category;
    ticket.priorityRationale = aiData.priorityRationale || ticket.priorityRationale;
    ticket.followUpQuestions = aiData.followUpQuestions || ticket.followUpQuestions;
    ticket.assumptions = aiData.assumptions || ticket.assumptions;

    // Optionally, store AI history
    ticket.aiHistory.push({
      originalPrompt: ticket.description,
      refinedPrompt: aiData.summary,
    });

    // 4️⃣ Save ticket
    await ticket.save();

    console.log("✅ Ticket updated with AI analysis:", ticket._id);
    return ticket;
  } catch (error) {
    console.error("❌ Error updating ticket with AI:", error.message);
    return null;
  }
};
