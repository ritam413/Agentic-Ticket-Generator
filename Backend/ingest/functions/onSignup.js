import { NonRetriableError } from "inngest"
import {inngest } from "../../ingest/client.js"
import User from "../../models/user.model.js"
import { sendMail } from "../../utils/mailer.js"


export const onUserSignup = inngest.createFunction({
    
        id:'onUserSignup',
        name:'onUserSignup',
        handler:'ingest/functions/onUserSignup.js',
        retries: 2
    },
    {
        event: "user/signup"
    },
    async ({event,step}) => {
        try {
            const {email} = event.data
            const user = await step.run("getUserEmail", async () => {
               const userObject = await User.findOne({email})

               if(!userObject){
                throw new NonRetriableError("User not found || User dont Exist in our database")
               }

               return userObject
            })

            await step.run("sendWelcomeEmail", async () => {
                const subject = `Welcome to App`
                const message = `Hello \n \n
                Thanks for signing up \n \n`
                await sendMail(user.email,subject,message)
            })


            return {success:true}
        } catch (error) {
            console.error(`❌ Error in onUserSignup.js\n and Error Message is : ${error.message}`)
        }
    }
)