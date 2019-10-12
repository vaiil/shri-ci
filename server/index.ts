import express from 'express'

interface Agent {
  port: number,
  host: string
}

interface Build {
  id: string,
  status: number,
  stdout: string,
  stderr: string
}

const app = express()
const builds: Array<Build> = []
const agents: Array<Agent> = []

app.get('/', () => {

})

app.get('/build/:buildHash', () => {

})

app.get('/notify_agent', (req) => {

  const agent: Agent = {
    port: req.query.port,
    host: req.query.host
  }

  agents.push(agent)
})

app.get('/notify_build_result', (req) => {
  const build = {
    id: req.query.id,
    status: req.query.status,
    stdout: req.query.stdout,
    stderr: req.query.stderr
  }

  builds.push(build)
})

app.listen(3000)