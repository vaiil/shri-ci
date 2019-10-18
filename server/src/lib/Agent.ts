import Task from './Task'
import fetch from 'node-fetch'
import { AgentStatus, RegisterAgentParams, StartBuildRequest } from 'shri-ci-typings'
import { response } from 'express'


export default class Agent {
  public readonly host: string
  public readonly port: number
  private status: AgentStatus
  private currentTask: Task | null = null

  constructor({ url, port }: RegisterAgentParams) {
    this.host = url
    this.port = port
    this.status = AgentStatus.ready
  }

  run(task: Task) {
    this.status = AgentStatus.working
    this.currentTask = task
    return this.makeRequest(task)
  }

  setFailed() {
    this.status = AgentStatus.failed
  }

  getStatus() {
    return this.status
  }

  isFree() {
    return this.status === AgentStatus.ready
  }

  free() {
    this.currentTask = null
    this.status = AgentStatus.ready
  }

  isSame(agent: Agent) {
    return agent.port === this.port && agent.host === this.host
  }

  toString() {
    return this.host + ':' + this.port
  }

  checkStatus() {
    return fetch(this.getAgentUrl())
  }

  private getAgentUrl() {
    return `http://${this.host}:${this.port}/`
  }

  private getUrl() {
    return this.getAgentUrl() + 'build'
  }

  private makeRequest(task: Task) {
    return fetch(this.getUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Agent.prepareTaskForApi(task))
    })
  }

  private static prepareTaskForApi(task: Task): StartBuildRequest {
    return {
      id: task.id,
      commitHash: task.commitHash,
      repoUrl: task.repoUrl,
      cmd: task.cmd
    }
  }
}
