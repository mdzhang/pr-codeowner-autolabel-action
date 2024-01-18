/**
 * Draws heavily from https://github.com/actions/labeler/blob/main/src/api/*.ts
 */

import * as github from '@actions/github'
import { ClientType } from './types'
import * as core from '@actions/core'

export const setLabels = async (
  client: ClientType,
  prNumber: number,
  labels: string[]
) => {
  await client.rest.issues.setLabels({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: prNumber,
    labels
  })
}

export const getChangedFiles = async (
  client: ClientType,
  prNumber: number
): Promise<string[]> => {
  const listFilesOptions = client.rest.pulls.listFiles.endpoint.merge({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: prNumber
  })

  const listFilesResponse = await client.paginate(listFilesOptions)
  const changedFiles = listFilesResponse.map((f: any) => f.filename)

  core.debug('found changed files:')
  for (const file of changedFiles) {
    core.debug(`  ${file}`)
  }

  return changedFiles
}

export async function getPullRequest(client: ClientType, prNumber: number) {
  let prData: any

  try {
    const result = await client.rest.pulls.get({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: prNumber
    })
    prData = result.data
  } catch (error: any) {
    core.warning(`Could not find pull request #${prNumber}, skipping`)
    return
  }

  core.debug(`fetching changed files for pr #${prNumber}`)
  const changedFiles: string[] = await getChangedFiles(client, prNumber)
  if (!changedFiles.length) {
    core.warning(`Pull request #${prNumber} has no changed files, skipping`)
    return
  }

  return {
    data: prData,
    number: prNumber,
    changedFiles
  }
}

export async function getCodeowners(
  client: ClientType,
  prNumber: number,
  filePath = 'CODEOWNERS'
) {
  core.debug(`fetching codeowners for pr #${prNumber} from path ${filePath}`)
  let fileContent: string

  try {
    const result = await client.rest.repos.getContent({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      path: filePath,
      ref: github.context.sha,
    })
    // @ts-expect-error false positive
    fileContent = Buffer.from(result.data.content, result.data.encoding).toString()
    core.debug(`codeowners fileContent is:\n${fileContent}`)
  } catch (error: any) {
    core.warning(`Could not find pull request #${prNumber}, skipping`)
    return []
  }

  // rm newlines & comments; convert to array of 2-tupes, <glob, team>
  const codeowners: string[][] = fileContent
    .split(/\r?\n/)
    .filter(l => l.trim().length > 0)
    .filter(l => !l.startsWith('#'))
    .map(l => l.split(' '))

  core.debug(`codeowners is #${codeowners}`)

  if (!codeowners.length) {
    core.warning(`Pull request #${prNumber} has no codeowners`)
    return []
  }

  return codeowners
}
