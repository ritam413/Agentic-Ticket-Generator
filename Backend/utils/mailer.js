import nodemailer from 'nodemailer'

export const sendMail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_SMTP_HOST,
            port: process.env.MAILTRAP_SMTP_PORT,
            secure: false, // upgrade later with STARTTLS
            auth: {
                user: process.env.MAILTRAP_SMTP_USER,
                pass: process.env.MAILTRAP_SMTP_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: '"Ingest TmS', // sender address
            to, 
            subject, 
            text, 
        });
        console.log("Message sent: %s", info.messageId);
        return info
    } catch (error) {
        console.log(`❌Error in Mailer.js: ${error}`)
        throw error
    }
}