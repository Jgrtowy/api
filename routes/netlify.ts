import { config } from "dotenv"
import express from "express"
const router = express.Router()
config()

router.post("/", async (req, res) => {
     if (req.query?.key !== process.env.NETLIFY_KEY)
          return res.status(401).json({ error: "Invalid key" })

     console.log(req.query)
     console.log(req.body)
     console.log(req.headers)

     try {
          res.json({ success: true })
     } catch (error) {
          res.json({ error })
     }
})

export default router
