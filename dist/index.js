"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_manager_1 = require("./util/config-manager");
const checker_1 = require("./util/checker");
const remote_to_git_url_1 = require("./util/remote_to_git_url");
const currentBranch = require('git-branch');
const opn = require('opn');
const gitRemoteOriginUrl = require('git-remote-origin-url');
const gitP = require('simple-git/promise');
const chalk_1 = require("chalk");
const git = gitP(process.cwd());
const log = (silence) => (content) => {
    !silence && content && console.log(content);
};
module.exports = {
    BranchTypes: config_manager_1.BranchTypes,
    newBranch(type = config_manager_1.BranchTypes.feature, id, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = log(config.silence || false);
            if (!(yield git.checkIsRepo())) {
                console.log(chalk_1.default.red('current project has not been initialized as a git repo, please check'));
                return false;
            }
            const prefix = config_manager_1.configManager.getPrefix(type);
            if (!prefix) {
                console.log(chalk_1.default.bgYellow(`no prefix specified for ${type} branch`));
                return false;
            }
            else {
                const branchName = `${prefix}${id}`;
                const curBranchName = currentBranch.sync();
                if (!(yield checker_1.checkIsWorkSpaceClean())) {
                    console.log(chalk_1.default.bgYellow('uncommitted changes found in current branch, please commit first'));
                    return false;
                }
                try {
                    if (curBranchName !== 'master') {
                        yield git.checkout('master').then((res) => {
                            logger(chalk_1.default.green('切换到master分支'));
                            logger(res);
                        });
                    }
                    yield git.pull().then((res) => {
                        logger(chalk_1.default.green('拉取&更新master分支'));
                        logger(res);
                    });
                    const localBranches = yield git.branchLocal();
                    if (localBranches && localBranches.branches && localBranches.branches[branchName]) {
                        logger(chalk_1.default.green('任务分支已存在，checkout到对应分支'));
                        return yield git.checkout(branchName).then((res) => {
                            logger(chalk_1.default.green(`已切换到${branchName}分支`));
                            logger(res);
                            return true;
                        });
                    }
                    else {
                        return yield git.checkoutLocalBranch(branchName).then((res) => {
                            logger(chalk_1.default.green(`已创建并切换到${branchName}分支`));
                            logger(res);
                            return git.push(['-u', 'origin', branchName]);
                        }).then((res) => {
                            console.log(chalk_1.default.green('推送新创建分支到 remote '));
                            res && console.log(res);
                            return true;
                        });
                    }
                }
                catch (err) {
                    console.log(err);
                    return err;
                }
            }
        });
    },
    mergeMasterToBranch(branchName, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = log(config.silence || false);
            if (!(yield git.checkIsRepo())) {
                console.log(chalk_1.default.red('current project has not been initialized as a git repo, please check'));
                return false;
            }
            try {
                return yield git.pull().then((res) => {
                    logger(chalk_1.default.green('拉取&更新当前开发分支'));
                    logger(res);
                    return git.checkout('master');
                }).then((res) => {
                    logger(chalk_1.default.green('切换到master分支'));
                    logger(res);
                    return git.pull();
                }).then((res) => {
                    logger(chalk_1.default.green('拉取&更新master分支'));
                    logger(res);
                    return git.checkout(branchName);
                }).then((res) => {
                    logger(chalk_1.default.green(`切换到${branchName}开发分支`));
                    logger(res);
                    return git.merge(['master']);
                }).then((res) => {
                    logger(chalk_1.default.green('合并master分支'));
                    logger(res);
                    return git.push('origin', branchName);
                }).then((res) => {
                    logger(chalk_1.default.green(`推送${branchName}分支到远程代码仓库`));
                    logger(res);
                    return true;
                });
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
    },
    mergeToMainBranch(branchName, mainBranch, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = log(config.silence || false);
            if (!(yield git.checkIsRepo())) {
                console.log(chalk_1.default.red('current project has not been initialized as a git repo, please check'));
                return false;
            }
            let envBranch;
            if (config.forceEnvBranch) {
                envBranch = config.forceEnvBranch;
            }
            else {
                const tempBranchName = yield config_manager_1.configManager.getBranchName(mainBranch);
                if (!tempBranchName) {
                    envBranch = '';
                    console.log(chalk_1.default.red(`${mainBranch}分支类型未配置对应的branch`));
                    return false;
                }
                else {
                    envBranch = tempBranchName;
                }
            }
            if (yield checker_1.checkIsMajorBranch(branchName)) {
                console.log(chalk_1.default.red('current branch is a major branch, not a feature branch, please check'));
                return false;
            }
            if (!(yield checker_1.checkIsWorkSpaceClean())) {
                console.log(chalk_1.default.red('uncommitted changes found in current branch, please commit first'));
                return false;
            }
            if (config.mergeMaster) {
                yield this.mergeMasterToBranch(branchName, { silence: config.silence });
            }
            const enforcePRtoMaster = yield config_manager_1.configManager.getEnforcePRtoMaster();
            if (envBranch === 'master' && enforcePRtoMaster) {
                const remoteOriginUrl = yield gitRemoteOriginUrl();
                const gitUrl = remote_to_git_url_1.default(remoteOriginUrl, 'sankuai', 'create-pr');
                console.log(chalk_1.default.bgYellow('禁止直接合并代码到master分支，请提交PR'));
                console.log(`地址：${gitUrl || '未获得有效url地址，请手动操作'}`);
                gitUrl && opn(gitUrl);
                return false;
            }
            try {
                return yield git.checkout(envBranch).then((res) => {
                    logger(chalk_1.default.green(`切换到${envBranch}分支`));
                    logger(res);
                    return git.pull();
                }).then((res) => {
                    logger(chalk_1.default.green(`更新${envBranch}分支`));
                    logger(res);
                    return git.merge([branchName]);
                }).then((res) => {
                    logger(chalk_1.default.green(`合并${branchName}分支到${envBranch}分支`));
                    logger(res);
                    return git.push('origin', envBranch);
                }).then((res) => {
                    logger(chalk_1.default.green(`推送${envBranch}到git仓库`));
                    logger(res);
                    return git.checkout(branchName);
                }).then((res) => {
                    logger(chalk_1.default.green(`checkout开发分支${envBranch}到workspace`));
                    logger(res);
                    return true;
                });
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
    },
    setConfig: config_manager_1.configManager.setConfig,
    setEnforcePRtoMaster: config_manager_1.configManager.setEnforcePRtoMaster
};
