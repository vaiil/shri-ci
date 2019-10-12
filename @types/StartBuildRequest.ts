export interface StartBuildRequest {
  id: string,
  repoUrl: string,
  commitHash: string,
  cmd: string
}
