import Task from './Task'
import Agent from './Agent'
import { RegisterBuildRequest } from '../../../@types/RegisterBuildRequest'

export default class Build {
  readonly id: string
  readonly status: number
  readonly stdout: string
  readonly stderr: string
  readonly task: Task | null = null
  readonly agent: Agent | null = null

  constructor({ id, status, stderr, stdout }: RegisterBuildRequest, task: Task | null, agent: Agent | null) {
    this.id = id
    this.status = status
    this.stderr = stderr
    this.stdout = stdout
    this.task = task
    this.agent = agent
  }
}
