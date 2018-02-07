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
  const gitName = pathes[2] && pathes[2].split('.')[0];
  const base = baseMap[gitServe];
  let url = '';
  if (gitServe === 'sankuai') {
    url = `${base}${pathes[1].toUpperCase()}/repos/${gitName}/${suffixMap[type] || 'browse'}`;
  }
  return url;
}
