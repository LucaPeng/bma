/**
 * @description 配置管理模块
 * @author lucaPeng
 */

export enum BranchTypes {
  feature = 1,
  bugfix,
  hotfix,
  custom,
}

interface BaseConfig {
  [index: string]: string
}

interface BMAConfig {
  [index: string]: any,
  enforcePRtoMaster?: boolean,
  branch: BaseConfig,
  branchPrefix: BaseConfig
}

let config: BMAConfig = {
  enforcePRtoMaster: true,
  branch: {
    master: 'master',
    dev: 'dev',
    qa: 'qa',
    stage: 'master',
    beta: 'beta'
  },
  branchPrefix: {
    feature: 'feature',
    bugfix: 'bugfix',
    hotfix: 'hotfix',
    custom: 'custom'
  }
};

export const configManager = {
  getBranchName(env: string) {
    return config.branch[env] || undefined;
  },
  getMajorBranches() {
    const branches = [];
    for (const branchIndex in config.branch) {
      branches.push(config.branch[branchIndex]);
    }
    return branches;
  },
  getPrefix(type: BranchTypes) {
    return config.branchPrefix[type] || undefined;
  },
  setConfig(key: string, newConfig: BaseConfig) {
    config[key] = Object.assign(config[key] || {}, newConfig);
  },
  setEnforcePRtoMaster(state: boolean) {
    config.enforcePRtoMaster = state;
  },
  getEnforcePRtoMaster(): boolean {
    return config.enforcePRtoMaster || false;
  }
};
