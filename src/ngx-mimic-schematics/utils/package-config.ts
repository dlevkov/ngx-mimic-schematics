import { Tree } from '@angular-devkit/schematics/src/tree/interface';
import { SchematicsException } from '@angular-devkit/schematics';

export function addPackageToPackageJson(
  host: Tree,
  type: string,
  pkg: string,
  version: string
): Tree {
  const json = getPackageJson(host);

  if (!json[type]) {
    json[type] = {};
  }

  if (!json[type][pkg]) {
    json[type][pkg] = version;
  }

  return setPackageJson(host, json);
}
export function getPackageJson(host: Tree) {
  if (!host.exists('package.json')) {
    throw new SchematicsException('Could not find package.json');
  }
  const sourceText = host.read('package.json')!.toString('utf-8');
  return JSON.parse(sourceText);
}

export function setPackageJson(host: Tree, json: Object): Tree {
  host.overwrite('package.json', JSON.stringify(json, null, 2));

  return host;
}
