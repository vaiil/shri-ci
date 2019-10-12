import express from 'express'
import CiApp from './lib/CiApp'


const port = 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded())


const ci = new CiApp()

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

console.log(`Server are running: http://localhost:${port}/`)
