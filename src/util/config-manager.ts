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

// default
const config: BMAConfig = {
  enforcePRtoMaster: true,
  branch: {
    online: 'master',
    dev: 'dev',
    qa: 'qa',
    stage: 'master',
    beta: 'beta'
  },
  branchPrefix: {
    [BranchTypes.feature]: 'feature/',
    [BranchTypes.bugfix]: 'bugfix/',
    [BranchTypes.hotfix]: 'hotfix/',
    [BranchTypes.custom]: 'custom/'
  }
};

export const configManager = {
  /**
   * 获取分支名称
   * @param env 环境名称
   */
  getBranchName(env: string) {
    return config.branch[env] || undefined;
  },
  /**
   * 获取主干分支
   */
  getMajorBranches() {
    const branches = [];
    for (const branchIndex in config.branch) {
      branches.push(config.branch[branchIndex]);
    }
    return branches;
  },
  /**
   * 获取开发分支名称前缀
   * @param type 开发分支类型
   */
  getPrefix(type: BranchTypes) {
    return config.branchPrefix[type] || undefined;
  },
  /**
   * 设置配置
   * @param key 配置key
   * @param newConfig 配置值 
   */
  setConfig(key: string, newConfig: BaseConfig) {
    config[key] = Object.assign(config[key] || {}, newConfig);
  },
  /**
   * 设置是否可以合并代码到master分支
   * @param state 状态
   */
  setEnforcePRtoMaster(state: boolean) {
    config.enforcePRtoMaster = state;
  },
  /**
   * 获取是否可以合并代码到master分支
   */
  getEnforcePRtoMaster(): boolean {
    return config.enforcePRtoMaster || false;
  }
};
