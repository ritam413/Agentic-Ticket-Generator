import express from 'express'
import {auth} from '../middlewares/auth.js'
import {createTicket, getTicket, getTickets} from '../controller/ticket.controller.js'

const router = express.Router()

router.get('/',auth,getTickets)
router.get('/:id',auth,getTicket)
router.post("/create-ticket",auth,createTicket)


export default router