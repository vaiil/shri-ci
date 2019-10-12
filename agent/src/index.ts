import express from 'express'
import Agent from './lib/Agent'

const app = express()
app.use(express.json())

const port = process.env.port ? parseInt(process.env.port) : 3001
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
    app.listen(3001)
  })
  .catch(reason => {
    console.log('Could not create agent by the following reason:')
    console.log(reason)
    console.log('Abort!')
  })



