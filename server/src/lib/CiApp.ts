import Agent from './Agent'
import Task, { TaskParams } from './Task'
import Build from './Build'
import { RegisterAgentParams, RegisterBuildRequest, AgentStatus } from 'shri-ci-typings'

export default class CiApp {
  private readonly agents: Array<Agent> = []
  private readonly pendingTasks: Map<string, Task> = new Map<string, Task>()
  private readonly deferredTasks: Array<Task> = []
  private readonly builds: Array<Build> = []
  private readonly repo: string

  constructor(repo: string) {
    this.repo = repo
  }

  public registerAgent(props: RegisterAgentParams) {
    const agent = new Agent(props)
    const oldAgentIndex = this.agents.findIndex(oldAgent => {
      return agent.isSame(oldAgent)
    })
    // if same agent given we reset it
    if (oldAgentIndex !== -1) {
      this.agents[oldAgentIndex] = agent
    } else {
      this.agents.push(agent)
    }

    this.runFromQueue(agent)
  }

  public addTask(params: TaskParams) {
    const task = new Task(params, this.repo)
    const agent = this.agents.find(agent => agent.getStatus() === AgentStatus.ready)
    if (agent) {
      this.run(task, agent)
    } else {
      this.deferredTasks.push(task)
    }
    return task.id
  }

  public registerBuild(props: RegisterBuildRequest) {
    const task = this.pendingTasks.get(props.id) || null
    let agent = null
    if (task) {
      this.pendingTasks.delete(props.id)
      agent = task.getAgent()
      if (agent) {
        agent.free()
        this.runFromQueue(agent)
      }
    }
    const build = new Build(props, task, agent)
    this.builds.push(build)
  }

  public getBuilds() {
    return this.builds
  }

  public getPendingTasks() {
    return this.pendingTasks
  }

  public getDeferredTasks() {
    return this.deferredTasks
  }

  public getBuild(id: string) {
    return this.builds.find(build => build.id === id) || null
  }

  public getAgents() {
    return this.agents
  }

  private run(task: Task, freeAgent: Agent) {
    task.setAgent(freeAgent)
    this.pendingTasks.set(task.id, task)
    freeAgent.run(task).catch(() => {
      freeAgent.setFailed()
      this.pendingTasks.delete(task.id)
      this.deferredTasks.push(task)
    })
  }

  private runFromQueue(freeAgent: Agent) {
    const task = this.deferredTasks.shift()
    if (task) {
      this.run(task, freeAgent)
    }
  }
}
