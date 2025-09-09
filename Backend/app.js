import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true , limit: '16kb' }));
app.use(express.static('public'));

//Protected Routes 
import userRoutes from './Routes/user.js';
import ticketRoutes from './Routes/ticket.js';
import { serve } from 'inngest/express';
import {inngest} from './ingest/client.js'
import { onUserSignup } from './ingest/functions/onSignup.js';
import { onTicketCreate } from './ingest/functions/onTicketCreate.js';


app.use('/api/auth',userRoutes)
app.use('/api/tickets',ticketRoutes)

app.use(
    "/api/inngest",
    serve({
        client:inngest,
        functions:[onUserSignup, onTicketCreate]
    }),
)


export {app}
