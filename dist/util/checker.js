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
const config_manager_1 = require("./config-manager");
const isGitClean = require('is-git-clean');
function checkIsMajorBranch(branchName) {
    return __awaiter(this, void 0, void 0, function* () {
        const majorBranches = yield config_manager_1.configManager.getMajorBranches();
        return majorBranches.indexOf(branchName) > -1;
    });
}
exports.checkIsMajorBranch = checkIsMajorBranch;
function checkIsWorkSpaceClean() {
    return __awaiter(this, void 0, void 0, function* () {
        const clean = yield isGitClean();
        return clean;
    });
}
exports.checkIsWorkSpaceClean = checkIsWorkSpaceClean;
