import * as urlParse from 'url-parse';

interface IStringObj {
  [index: string]: string
}

const baseMap: IStringObj = {
  'sankuai': 'http://git.sankuai.com/v1/bj/projects/'
};

const suffixMap: IStringObj = {
  'browse': 'browse',
  'branches': 'branches',
  'pr': 'pull-requests',
  'create-pr': 'compare/commits'
};

export default function (remote: string, gitServe: string = 'sankuai', type: string = 'browse'): string {
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
    } else {
      console.log('解析获取 git url 失败');
    }
  }
  return url;
}
