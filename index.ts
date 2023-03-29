import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import rateLimit from "express-rate-limit"

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())

const limiter = rateLimit({
     windowMs: 10 * 60000,
     max: 100,
     message: "Hold up, you're making too many requests! Try again in 10 minutes.",
     standardHeaders: true,
     legacyHeaders: false,
})
app.use(limiter)

import rcon from "./routes/rcon"
import root from "./routes/root"
import status from "./routes/status"
app.use("/", root)
app.use("/status", status)
app.use("/rcon", rcon)

app.listen(process.env.PORT || 5000)
