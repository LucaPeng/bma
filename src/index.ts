/**
 * @description 抽象分支管理
 * @author lucaPeng
 */

import { BranchTypes, configManager } from './util/config-manager';
import { checkIsMajorBranch, checkIsWorkSpaceClean } from './util/checker';
import remoteToGitURL from './util/remote_to_git_url';
const currentBranch = require('git-branch');
const opn = require('opn');
const gitRemoteOriginUrl = require('git-remote-origin-url');
const gitP = require('simple-git/promise');
import chalk from 'chalk';

const git = gitP(process.cwd());
// 日志打印
const log = (silence: boolean) => (content: any) => {
  silence && content && console.log(content);
};

export default {
  async newBranch(type: BranchTypes = BranchTypes.feature, id: number | string, config: {silence?: boolean}) {
    const logger = log(config.silence || false);
    const prefix = configManager.getPrefix(type);
    if (!prefix) {
      console.log(chalk.bgYellow(`no prefix specified for ${type} branch`));
      return false;
    } else {
      const branchName = `${prefix}-${id}`;
      const curBranchName = currentBranch.sync();
      if (await checkIsWorkSpaceClean()) {
        console.log(chalk.red('uncommitted changes found in current branch, please commit first'));
        return false;
      }
      try {
        if (curBranchName !== 'master') {
          await git.checkout('master').then((res: any) => {
            logger(chalk.green('切换到master分支'));
            logger(res);
          });
        }
        await git.pull().then((res: any) => {
          logger(chalk.green('拉取&更新master分支'));
          logger(res);
        });
        const localBranches = await git.branchLocal();
        if (localBranches && localBranches.branches && localBranches.branches[branchName]) {
          logger(chalk.green('任务分支已存在，checkout到对应分支'));
          return await git.checkout(branchName).then((res: any) => {
            logger(chalk.green(`已切换到${branchName}分支`));
            logger(res);
            return true;
          });
        } else {
          return await git.checkoutLocalBranch(branchName).then((res: any) => {
            logger(chalk.green(`已创建并切换到${branchName}分支`));
            logger(res);
            return git.push(['-u', 'origin', branchName]);
          }).then((res?: any) => {
            // 完成任务
            console.log(chalk.green('推送新创建分支到 remote '));
            res && console.log(res);
            return true;
          });
        }
      } catch (err) {
        console.log(err);
        return err;
      }
    }
  },
  /**
   * 合并master分支到特定分支
   * @param branchName {String} 分支名称
   */
  async mergeMasterToBranch(branchName: string, config: {silence?: boolean}) {
    const logger = log(config.silence || false);
    try {
      return await git.pull().then((res: any) => {
        logger(chalk.green('拉取&更新当前开发分支'));
        logger(res);
        return git.checkout('master');
      }).then((res: any) => {
        logger(chalk.green('切换到master分支'));
        logger(res);
        return git.pull();
      }).then((res: any) => {
        logger(chalk.green('拉取&更新master分支'));
        logger(res);
        return git.checkout(branchName);
      }).then((res: any) => {
        logger(chalk.green(`切换到${branchName}开发分支`));
        logger(res);
        return git.merge(['master']);
      }).then((res: any) => {
        logger(chalk.green('合并master分支'));
        logger(res);
        return git.push('origin', branchName);
      }).then((res: any) => {
        logger(chalk.green(`推送${branchName}分支到远程代码仓库`));
        logger(res);
        return true;
      });
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  /**
   * 合并分支到特定的主干分支
   */
  async mergeToMainBranch(branchName: string, mainBranch: string, config: {mergeMaster: boolean, forceEnvBranch?: string, silence?: boolean}) {
    // 获取部署环境对应的分支名
    let envBranch: string;
    if (config.forceEnvBranch) {
      // 如果指定的分支名
      envBranch = config.forceEnvBranch;
    } else {
      const tempBranchName = await configManager.getBranchName(mainBranch);
      // 检查是否配置了该环境对应的主干分支
      if (!tempBranchName) {
        envBranch = '';
        console.log(chalk.red(`${mainBranch}分支类型未配置对应的branch`));
        return false;
      } else {
        envBranch = tempBranchName;
      }
    }

    // 检查当前分支是否是主干分支
    if (await checkIsMajorBranch(branchName)) {
      console.log(chalk.red('current branch is a major branch, not a feature branch, please check'));
      return false;
    }

    // 检查当前环境是否有未提交的代码
    if (!await checkIsWorkSpaceClean()) {
      console.log(chalk.red('uncommitted changes found in current branch, please commit first'));
      return false;
    }

    // 合并master分支到当前分支
    if (config.mergeMaster) {
      await this.mergeMasterToBranch(branchName, { silence: config.silence });
    }

    // 如果禁止直接提交代码到master
    const enforcePRtoMaster = await configManager.getEnforcePRtoMaster();
    if (envBranch === 'master' && enforcePRtoMaster) {
      const remoteOriginUrl = await gitRemoteOriginUrl();
      const gitUrl = remoteToGitURL(remoteOriginUrl, 'git.sankuai', 'create-pr');
      console.log(chalk.bgYellow('禁止直接合并代码到master分支，请提交PR'));
      console.log(`地址：${gitUrl}`);
      opn(gitUrl);
      return false;
    }

    try {
      return await git.checkout(envBranch).then((res: any) => {
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
        return true;
      });
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  setConfig: configManager.setConfig,
  setEnforcePRtoMaster: configManager.setEnforcePRtoMaster
};
