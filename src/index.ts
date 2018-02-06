/**
 * @description 抽象分支管理
 * @author songpeng02
 */

import commandConfig from '../config-manager';
import remoteToGitURL from '../../utils/remote_to_git_url';
const opn = require('opn');
const gitRemoteOriginUrl = require('git-remote-origin-url');
const isGitClean = require('is-git-clean');
const gitP = require('simple-git/promise');
const git = gitP(process.cwd());
import chalk from 'chalk';

export default {
  /**
   * 检查是否是主干分支
   * @param branchName {String} 分支名称
   */
  async checkIsMajorBranch(branchName: string) {
    const majorBranches = await commandConfig.getMajorBranches();
    return majorBranches.indexOf(branchName) > -1;
  },
  /**
   * 检查当前workSpace 是否有未提交的代码
   */
  async checkIsWorkSpaceClean() {
    const clean = await isGitClean();
    return clean;
  },
  /**
   * 合并master分支到特定分支
   * @param branchName {String} 分支名称
   */
  async mergeMasterToBranch(branchName: string) {
    try {
      return await git.pull().then((res: any) => {
        console.log(chalk.green('拉取&更新当前开发分支'));
        res && console.log(res);
        return git.checkout('master');
      }).then((res: any) => {
        console.log(chalk.green('切换到master分支'));
        res && console.log(res);
        return git.pull();
      }).then((res: any) => {
        console.log(chalk.green('拉取&更新master分支'));
        res && console.log(res);
        return git.checkout(branchName);
      }).then((res: any) => {
        console.log(chalk.green(`切换到${branchName}开发分支`));
        res && console.log(res);
        return git.merge(['master']);
      }).then((res: any) => {
        console.log(chalk.green('合并master分支'));
        res && console.log(res);
        return git.push('origin', branchName);
      }).then((res: any) => {
        console.log(chalk.green(`推送${branchName}分支到远程代码仓库`));
        res && console.log(res);
        return res;
      });
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  },

  /**
   * 合并分支到特定环境对应的主干分支
   */
  async mergeBranchToEnv(branchName: string, env: string, config: {mergeMaster: boolean, forceEnvBranch?: string}) {
    // 获取部署环境对应的分支名
    let envBranch: string;
    if (config.forceEnvBranch) {
      // 如果指定的分支名
      envBranch = config.forceEnvBranch;
    } else {
      const tempBranchName = await commandConfig.getBranchName(env);
      // 检查是否配置了该环境对应的主干分支
      if (!tempBranchName) {
        envBranch = '';
        console.log(chalk.red(`${env}发布环境未配置对应的branch`));
        process.exit(1);
      } else {
        envBranch = tempBranchName;
      }
    }
    
    // 检查当前分支是否是主干分支
    if (await this.checkIsMajorBranch(branchName)) {
      console.log(chalk.red('current branch is a major branch, not a feature branch, please check'));
      process.exit(1);
    }
    
    // 检查当前环境是否有未提交的代码
    if (!await this.checkIsWorkSpaceClean()) {
      console.log(chalk.red('uncommitted changes found in current branch, please commit first'));
      process.exit(1);
    }

    // 合并master分支到当前分支
    if (config.mergeMaster) {
      await this.mergeMasterToBranch(branchName);
    }

    // 如果禁止直接提交代码到master
    const enforcePRtoMaster = await commandConfig.getConfig('enforcePRtoMaster');
    if (envBranch === 'master' && enforcePRtoMaster) {
      const remoteOriginUrl = await gitRemoteOriginUrl();
      const gitUrl = remoteToGitURL(remoteOriginUrl, 'git.sankuai', 'create-pr');
      console.log(chalk.bgYellow(`禁止直接合并代码到master分支，请提交PR`));
      console.log(`地址：${gitUrl}`);
      opn(gitUrl);
      process.exit(0);
    }

    let res;
    try {
      res = await git.checkout(envBranch).then((res: any) => {
        console.log(chalk.green(`切换到${envBranch}分支`));
        res && console.log(res);
        return git.pull();
      }).then((res: any) => {
        console.log(chalk.green(`更新${envBranch}分支`));
        res && console.log(res);
        return git.merge([branchName]);
      }).then((res: any) => {
        console.log(chalk.green(`合并${branchName}分支到${envBranch}分支`));
        res && console.log(res);
        return git.push('origin', envBranch);
      }).then((res: any) => {
        console.log(chalk.green(`推送${envBranch}到git仓库`));
        res && console.log(res);
        return git.checkout(branchName);
      }).then((res: any) => {
        console.log(chalk.green(`checkout开发分支${envBranch}到workspace`));
        res && console.log(res);
        return res;
      });
    } catch(err) {
      console.log(err);
      process.exit(1);
    }
    return res;
  }
};
