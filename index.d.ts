// Type definitions for BMA
export as namespace bma;
export enum BranchTypes {
  feature = 1,
  bugfix,
  hotfix,
  custom,
}

export interface BaseConfig {
  [index: string]: string;
}

export interface BMAConfig {
  [index: string]: any;
  enforcePRtoMaster?: boolean;
  branch: BaseConfig;
  branchPrefix: BaseConfig;
}

export function newBranch(type: BranchTypes, id: number | string, config: {silence?: boolean}): Promise <boolean | object>
export function mergeMasterToBranch(branchName: string, config: {silence?: boolean}): Promise <boolean | object>
export function mergeToMainBranch(branchName: string, mainBranch: string, config: {mergeMaster: boolean, forceEnvBranch?: string, silence?: boolean}): Promise <boolean | object>
export function deleteAndUpdateMaster(branchName: string, config: {silence?: boolean}) : Promise <boolean>
export function setConfig(key: string, newConfig: BaseConfig): void
export function setEnforcePRtoMaster(state: boolean): void
