import express from 'express'



const router = express.Router()

import { auth } from '../middlewares/auth.js'
import { login, logout, signup, createSuperAdmin , updateUser ,getUser, checkAuth} from '../controller/user.controller.js'

router.post('/create-superadmin', createSuperAdmin)
router.post('/signup', signup)
router.post('/login', login)
router.get('/checkAuth', checkAuth)
router.post('/logout', logout)
router.patch('/update-user', auth,updateUser)
router.get('/get-users',auth,getUser)

export default router