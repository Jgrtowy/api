import express from "express"
import * as path from "path"
const router = express.Router()

router.get("/", async (req, res) => res.send("API Working!"))
export default router
