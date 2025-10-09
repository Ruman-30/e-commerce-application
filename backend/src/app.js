import express from "express"
import userRoutes from "./routes/user.routes.js"
import adminRoutes from "./routes/admin.route.js"
import productRoutes from "./routes/product.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import orderRoutes from "./routes/order.routes.js"
import paymentRoutes from "./routes/payment.route.js"
import reviewRoutes from "./routes/review.route.js"
import cookieParser from "cookie-parser"
import swaggerSpec from "./config/swagger.js"
import swaggerUi from "swagger-ui-express"
import passport from "./config/passport.js"
const app = express()
import cors from "cors";
app.use(cors({
  origin: "http://localhost:5173", // or specify your frontend domain instead of "*"
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true // allow cookies to be sent

}));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(passport.initialize());
app.use(cookieParser())
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use("/auth", userRoutes)
app.use("/admin", adminRoutes)
app.use("/products", productRoutes)
app.use("/cart", cartRoutes)
app.use("/order", orderRoutes)
app.use("/payment", paymentRoutes)
app.use("/review", reviewRoutes)
export default app