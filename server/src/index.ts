import express from 'express'
import { config } from 'dotenv'
import minimist from 'minimist'
import CiApp from './lib/CiApp'
import process from 'process'

config()

const argv = minimist(process.argv)

const port = parseInt(argv.port || process.env.PORT || 3000)

const repo = argv.repo || process.env.REPO || 'https://github.com/vaiil/shri-ci.git'

if (!repo) {
  process.exit(1)
}

const app = express()

app.use(express.json())
app.use(express.urlencoded())


const ci = new CiApp(repo)

app.set('view engine', 'pug')

app.get('/', (req, res) => {
  const builds = ci.getBuilds()
  const pendingTasks = [...ci.getPendingTasks().values()]
  const deferredTasks = ci.getDeferredTasks()
  const agents = ci.getAgents()
  res.render('index', { builds, deferredTasks, pendingTasks, agents })
})

app.post('/', (req, res) => {
  const id = ci.addTask(req.body)
  res.redirect('/?hash=' + id)
})

app.get('/build/:id', (req, res) => {
  const build = ci.getBuild(req.params.id)
  if (!build) {
    res.status(404).send('Error')
    return
  }
  res.render('build', build)
})

app.post('/notify_agent', (req, res) => {
  ci.registerAgent(req.body)
  res.send({
    status: 'success'
  })
})

app.post('/notify_build_result', (req, res) => {
  ci.registerBuild(req.body)
  res.send({ status: 'success' })
})

app.listen(port)

console.log(`Server is running: http://localhost:${port}/`)
