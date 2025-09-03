import express from 'express'
import { authentication } from '../middleware/auth.middleware.js'
import { createPaymentOrderController, verifyPaymentController } from '../controllers/payment.controller.js'
const router = express.Router()


router.post("/create-order", authentication, createPaymentOrderController)
router.post("/verify-payment", authentication, verifyPaymentController)




export default router