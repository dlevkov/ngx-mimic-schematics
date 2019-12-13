import {
  Rule,
  SchematicContext,
  Tree,
  SchematicsException
} from '@angular-devkit/schematics';

import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addPackageToPackageJson } from './utils/package-config';
import { Schema } from './schema';
import { insertImport } from './utils/ast-tools';
import { createSourceFile, ScriptTarget, SourceFile } from 'typescript';
import { InsertChange } from './utils/change';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngxMimicSchematics(options: Schema): Rule {
  if (!options.environment) {
    throw new SchematicsException(
      `Invalid options, "env" is required.${options}`
    );
  }

  return (tree: Tree, context: SchematicContext) => {
    addPackageToPackageJson(tree, 'mimic', `latest`);

    context.addTask(new NodePackageInstallTask());

    addMimicToMain();
    return tree;
  };
}
function addMimicToMain() {
  return (host: Tree, context: SchematicContext) => {
    const filePath = './src/main.ts';

    const logger = context.logger;

    if (!filePath) {
      logger.error(`Could not find the default style file for this project.`);
      logger.info(
        `Please consider manually setting up the Roboto font in your CSS.`
      );
      return;
    }

    const buffer = host.read(filePath);

    if (!buffer) {
      logger.error(
        `Could not read the default style file within the project ` +
          `(${filePath})`
      );
      logger.info(`Please consider manually setting up the Robot font.`);
      return;
    }

    const textContent = buffer.toString();

    const sFile = createSourceFile(
      filePath,
      textContent,
      ScriptTarget.Latest,
      true
    );

    const changes: any = [
      insertImport(sFile, filePath, 'isDevMode', '@angular/core'),
      updateMainTs(filePath, sFile)
    ];
    return applyChanges(host, filePath, changes);
  };
}
export function applyChanges(
  host: Tree,
  path: string,
  changes: InsertChange[]
): Tree {
  const recorder = host.beginUpdate(path);
  for (const change of changes) {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(recorder);
  return host;
}

function updateMainTs(filePath: string, sourceFile: SourceFile) {
  const end = sourceFile.getEnd();

  return new InsertChange(
    filePath,
    end,
    `
    (require as any).ensure(['mimic'], require => {
    require('mimic');
  });
    `
  );
}
