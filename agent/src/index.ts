import express from 'express'
import { config } from 'dotenv'
import minimist from 'minimist'
import Agent from './lib/Agent'
import process from "process"

const app = express()
app.use(express.json())


config()

const argv = minimist(process.argv)

const port = parseInt(argv.port || process.env.PORT || 3000)

const host = argv.host || process.env.AGENT_HOST || 'localhost'

process.env.SERVER_URL = argv.server || process.env.SERVER_URL || 'http://localhost:3000'

Agent.createAgent({
  port,
  url: host
})
  .then(agent => {
    app.post('/build', (req, res) => {
      agent.registerBuildTask(req.body)
      res.send({ status: 'success' })
    })
    app.listen(port)
    console.log(`Agent is running: http://${host}:${port}/`)
  })
  .catch(reason => {
    console.error('Could not create agent by the following reason:')
    console.info(reason)
    console.error('Abort!')
  })



