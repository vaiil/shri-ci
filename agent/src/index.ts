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

const url = process.env.port || 'localhost'

Agent.createAgent({
  port,
  url: url
})
  .then(agent => {
    app.post('/build', (req, res) => {
      agent.registerBuildTask(req.body)
      res.send({ status: 'success' })
    })
    app.listen(port)
  })
  .catch(reason => {
    console.log('Could not create agent by the following reason:')
    console.log(reason)
    console.log('Abort!')
  })



