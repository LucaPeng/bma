import {configManager} from './config-manager';
const isGitClean = require('is-git-clean');

/**
 * 检查是否是主干分支
 * @param branchName {String} 分支名称
 */
export async function checkIsMajorBranch(branchName: string) {
  const majorBranches = await configManager.getMajorBranches();
  return majorBranches.indexOf(branchName) > -1;
}
/**
 * 检查当前workSpace 是否有未提交的代码
 */
export async function checkIsWorkSpaceClean() {
  const clean = await isGitClean();
  return clean;
}