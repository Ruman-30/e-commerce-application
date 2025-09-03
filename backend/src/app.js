import express from "express"
import userRoutes from "./routes/user.routes.js"
import adminRoutes from "./routes/admin.route.js"
import productRoutes from "./routes/product.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import orderRoutes from "./routes/order.routes.js"
import paymentRoutes from "./routes/payment.route.js"
import cookieParser from "cookie-parser"
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use("/auth", userRoutes)
app.use("/admin", adminRoutes)
app.use("/products", productRoutes)
app.use("/cart", cartRoutes)
app.use("/order", orderRoutes)
app.use("/payment", paymentRoutes)
export default app