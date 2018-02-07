"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const urlParse = require("url-parse");
const baseMap = {
    'sankuai': 'http://git.sankuai.com/v1/bj/projects/'
};
const suffixMap = {
    'browse': 'browse',
    'branches': 'branches',
    'pr': 'pull-requests',
    'create-pr': 'compare/commits'
};
function default_1(remote, gitServe = 'sankuai', type = 'browse') {
    const urlObj = urlParse(remote, true);
    const path = urlObj.pathname;
    const pathes = path && path.substr(1).split('/');
    const gitName = pathes[2] && pathes[2].split('.')[0];
    const base = baseMap[gitServe];
    let url = '';
    if (gitServe === 'sankuai') {
        url = `${base}${pathes[1].toUpperCase()}/repos/${gitName}/${suffixMap[type] || 'browse'}`;
    }
    return url;
}
exports.default = default_1;
