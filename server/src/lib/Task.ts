import uniqueString from 'unique-string'
import Agent from './Agent'

export interface TaskParams {
  commitHash: string,
  cmd: string
}

export default class Task {
  readonly id: string
  readonly registeredAt: number
  readonly cmd: string
  readonly commitHash: string
  readonly repoUrl: string
  private agent: Agent | null = null

  constructor({ cmd, commitHash }: TaskParams) {
    this.registeredAt = Date.now()
    this.cmd = cmd
    this.commitHash = commitHash
    this.id = uniqueString()
    this.repoUrl = 'https://github.com/vaiil/shri-ci.git'
  }

  setAgent(agent: Agent) {
    this.agent = agent
  }

  getAgent() {
    return this.agent
  }
}
