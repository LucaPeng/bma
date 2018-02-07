// Type definitions for BMA

declare enum BranchTypes {
  feature = 1,
  bugfix,
  hotfix,
  custom,
}

declare interface BaseConfig {
  [index: string]: string
}

declare interface BMAConfig {
  [index: string]: any,
  enforcePRtoMaster?: boolean,
  branch: BaseConfig,
  branchPrefix: BaseConfig
}

declare interface BMA {
  newBranch(type: BranchTypes, id: number | string, config: {silence?: boolean}): Promise <boolean | object>,
  mergeMasterToBranch(branchName: string, config: {silence?: boolean}): Promise <boolean | object>,
  mergeToMainBranch(branchName: string, mainBranch: string, config: {mergeMaster: boolean, forceEnvBranch?: string, silence?: boolean}): Promise <boolean | object>,
  setConfig(key: string, newConfig: BaseConfig): void,
  setEnforcePRtoMaster(state: boolean): void
}

declare const bma: BMA;

export = bma;