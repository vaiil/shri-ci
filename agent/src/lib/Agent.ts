import fetch from 'node-fetch'
import { exec } from 'child_process'
import { promisify } from 'util'
import { dir, DirectoryResult } from 'tmp-promise'
import { RegisterBuildRequest, RegisterAgentParams, StartBuildRequest, AgentStatus } from 'shri-ci-typings'

const execPromise = promisify(exec)

export default class Agent {
  private status: AgentStatus = AgentStatus.ready

  registerBuildTask(params: StartBuildRequest) {
    if (this.status === AgentStatus.failed) {
      throw new Error('Agent was failed')
    }
    if (this.status === AgentStatus.working) {
      throw new Error('Agent is busy')
    }
    this.startBuildTask(params).then(this.notify)
  }

  async notify(build: RegisterBuildRequest) {
    console.log(build)
    return fetch(Agent.getBuildUrl(), {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(build)
    })
      .then(response => {
        const data = response.json()
        //TODO add logic if server is down or returns error
      })
  }

  async downloadRepo(path: string, repoUrl: string, ref: string) {
    await execPromise(`git clone '${repoUrl}' . && git checkout '${ref}'`, {
      cwd: path,
      env: {
        GIT_TERMINAL_PROMPT: '0'
      }
    })
  }

  async runCommand(path: string, cmd: string) {
    return {
      ...await execPromise(cmd, {
        cwd: path
      }),
      status: 0
    }

  }

  async build(tmp: DirectoryResult, params: StartBuildRequest) {
    try {
      await this.downloadRepo(tmp.path, params.repoUrl, params.commitHash)
      return await this.runCommand(tmp.path, params.cmd)
    } catch (error) {
      return {
        status: error.code,
        stdout: error.stdout,
        stderr: error.stderr
      }
    }
  }


  async startBuildTask(params: StartBuildRequest): Promise<RegisterBuildRequest> {
    const tmp = await dir({ unsafeCleanup: true })
    const result = await this.build(tmp, params)
    await tmp.cleanup()
    return {
      id: params.id,
      ...result
    }
  }

  static async createAgent(params: RegisterAgentParams) {
    return fetch(this.getRegisterUrl(), {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
      .then(response => {
        const data = response.json()
        if (response.status !== 200) {
          throw data || 'Error'
        }
        return new Agent()
      })
  }

  static getRegisterUrl() {
    return `${process.env.SERVER_URL!}/notify_agent`
  }

  static getBuildUrl() {
    return `${process.env.SERVER_URL!}/notify_build_result`
  }
}
