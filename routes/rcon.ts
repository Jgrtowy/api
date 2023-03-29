import express from "express"
import { Rcon } from "rcon-client/lib"
const router = express.Router()

router.post("/", async (req, res) => {
     if (
          !req.body?.host ||
          !req.body?.port ||
          !req.body?.password ||
          !req.body?.command
     )
          return res.status(400).json({ error: "Missing required fields" })
     const { host, port, password, command } = req.body

     const data = {
          host: host,
          port: port,
          password: password,
          command: command,
     }

     const rcon = new Rcon(data)

     try {
          await rcon.connect()
          const response = await rcon.send(command)
          await rcon.end()
          res.json(response)
     } catch (error) {
          res.json({ error })
     }
})

export default router
