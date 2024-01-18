/**
 * Draws heavily from https://github.com/actions/labeler/blob/main/src/labeler.ts
 */

import * as core from '@actions/core';
import * as github from '@actions/github';
import * as pluginRetry from '@octokit/plugin-retry';
import isEqual from 'lodash.isequal';
import * as api from './api';
import { ClientType } from './types';

// GitHub Issues cannot have more than 100 labels
const GITHUB_MAX_LABELS = 100;

/**
 * The main function for the action.
 *
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export const run = () =>
  labeler().catch(error => {
    core.error(error);
    core.setFailed(error.message);
  });

async function labeler() {
  const { token, filePath, prNumber, labelMap } = getInputs();

  const client: ClientType = github.getOctokit(token, {}, pluginRetry.retry);

  const pullRequest = await api.getPullRequest(client, prNumber);
  if (!pullRequest) {
    return;
  }

  const codeowners = await api.getCodeowners(client, prNumber, filePath);
  if (codeowners.length == 0) {
    return;
  }

  const preexistingLabels = pullRequest.data.labels.map(l => l.name);
  const allLabels: Set<string> = new Set<string>(preexistingLabels);

  const labels = getMatchingCodeownerLabels(pullRequest.changedFiles, codeowners, labelMap);

  for (const label of labels) {
    allLabels.add(label);
  }

  const labelsToAdd = [...allLabels].slice(0, GITHUB_MAX_LABELS);

  let newLabels: string[] = [];

  try {
    if (!isEqual(labelsToAdd, preexistingLabels)) {
      await api.setLabels(client, pullRequest.number, labelsToAdd);
      newLabels = labelsToAdd.filter(
        label => !preexistingLabels.includes(label)
      );
    }
  } catch (error: any) {
    if (
      error.name !== 'HttpError' ||
      error.message !== 'Resource not accessible by integration'
    ) {
      throw error;
    }

    core.warning(
      `The action requires write permission to add labels to pull requests. For more information please refer to the action documentation: https://github.com/mdzhang/pr-codeowners-autolabeler-action#permissions`,
      {
        title: `${process.env['GITHUB_ACTION_REPOSITORY']} running under '${github.context.eventName}' is misconfigured`
      }
    );

    core.setFailed(error.message);

    return;
  }

  core.setOutput('new-labels', newLabels.join(','));
  core.setOutput('all-labels', labelsToAdd.join(','));
}

export function getMatchingCodeownerLabels(
  changedFiles: string[],
  entries: string[],
  labelMap: Map<string, string>
): string[] {
  // TODO
  for (const config of matchConfigs) {
    core.debug(` checking config ${JSON.stringify(config)}`);
    if (!checkMatch(changedFiles, config, dot)) {
      return false;
    }
  }

  return true;
}
