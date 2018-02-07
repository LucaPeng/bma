"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BranchTypes;
(function (BranchTypes) {
    BranchTypes[BranchTypes["feature"] = 1] = "feature";
    BranchTypes[BranchTypes["bugfix"] = 2] = "bugfix";
    BranchTypes[BranchTypes["hotfix"] = 3] = "hotfix";
    BranchTypes[BranchTypes["custom"] = 4] = "custom";
})(BranchTypes = exports.BranchTypes || (exports.BranchTypes = {}));
let config = {
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
exports.configManager = {
    getBranchName(env) {
        return config.branch[env] || undefined;
    },
    getMajorBranches() {
        const branches = [];
        for (const branchIndex in config.branch) {
            branches.push(config.branch[branchIndex]);
        }
        return branches;
    },
    getPrefix(type) {
        return config.branchPrefix[type] || undefined;
    },
    setConfig(key, newConfig) {
        config[key] = Object.assign(config[key] || {}, newConfig);
    },
    setEnforcePRtoMaster(state) {
        config.enforcePRtoMaster = state;
    },
    getEnforcePRtoMaster() {
        return config.enforcePRtoMaster || false;
    }
};
