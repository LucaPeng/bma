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
    let url = '';
    if (gitServe === 'sankuai') {
        const length = pathes.length;
        if (length >= 2) {
            const gitName = pathes[length - 1] && pathes[length - 1].split('.')[0];
            const group = pathes[length - 2];
            const base = baseMap[gitServe];
            url = `${base}${group.toUpperCase()}/repos/${gitName}/${suffixMap[type] || 'browse'}`;
        }
        else {
            console.log('解析获取 git url 失败');
        }
    }
    return url;
}
exports.default = default_1;
