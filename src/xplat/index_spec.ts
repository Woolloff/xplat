import { Tree, VirtualTree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
// import { getFileContent } from '@schematics/angular/utility/test';
import * as path from 'path';

import { Schema as XPlatOptions } from './schema';
import { createEmptyWorkspace, supportedPlatforms } from '../utils';

describe('xplat schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@nstudio/schematics',
    path.join(__dirname, '../collection.json'),
  );
  const defaultOptions: XPlatOptions = {
    npmScope: 'testing',
    sample: true,
    prefix: 'ft', // foo test
  };

  let appTree: Tree;

  beforeEach(() => {
    appTree = new VirtualTree();
    appTree = createEmptyWorkspace(appTree);
  });

  it('should create default xplat support for web,nativescript + libs + testing support', () => {
    const options: XPlatOptions = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('xplat', options, appTree);
    const files = tree.files;
    expect(files.indexOf('/libs/core/index.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/libs/features/index.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/libs/scss/package.json')).toBeGreaterThanOrEqual(0);

    expect(files.indexOf('/testing/karma.conf.js')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/testing/test.libs.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/testing/test.xplat.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/testing/tsconfig.libs.json')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/testing/tsconfig.libs.spec.json')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/testing/tsconfig.xplat.json')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/testing/tsconfig.xplat.spec.json')).toBeGreaterThanOrEqual(0);

    expect(files.indexOf('/xplat/web/index.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/xplat/nativescript/index.ts')).toBeGreaterThanOrEqual(0);
  });

  it('should create default xplat support (without sample feature) for web,nativescript', () => {
    const options: XPlatOptions = { ...defaultOptions };
    options.sample = false;

    const tree = schematicRunner.runSchematic('xplat', options, appTree);
    const files = tree.files;
    expect(files.indexOf('/xplat/web/features/items/items.module.ts')).toBe(-1);
    expect(files.indexOf('/xplat/web/index.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/xplat/nativescript/index.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/xplat/nativescript/features/items/items.module.ts')).toBe(-1);
  });

  it('should create default xplat support for web only', () => {
    const options: XPlatOptions = { ...defaultOptions };
    options.platforms = 'web';

    const tree = schematicRunner.runSchematic('xplat', options, appTree);
    const files = tree.files;
    expect(files.indexOf('/xplat/web/index.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/xplat/nativescript/index.ts')).toBeGreaterThanOrEqual(-1);
  });

  it('should create default xplat support for nativescript only', () => {
    const options: XPlatOptions = { ...defaultOptions };
    options.platforms = 'nativescript';

    const tree = schematicRunner.runSchematic('xplat', options, appTree);
    const files = tree.files;
    expect(files.indexOf('/xplat/web/index.ts')).toBeGreaterThanOrEqual(-1);
    expect(files.indexOf('/xplat/nativescript/index.ts')).toBeGreaterThanOrEqual(0);
  });

  // it('should create default xplat support for ssr only', () => {
  //   const options: XPlatOptions = { ...defaultOptions };
  //   options.platforms = 'ssr';

  //   const tree = schematicRunner.runSchematic('xplat', options, appTree);
  //   const files = tree.files;
  //   expect(files.indexOf('/xplat/web/index.ts')).toBeGreaterThanOrEqual(-1);
  //   expect(files.indexOf('/xplat/nativescript/index.ts')).toBeGreaterThanOrEqual(-1);
  //   expect(files.indexOf('/xplat/ssr/index.ts')).toBeGreaterThanOrEqual(0);
  // });

  // it('should create default xplat support for nativescript,ssr only', () => {
  //   const options: XPlatOptions = { ...defaultOptions };
  //   options.platforms = 'nativescript,ssr';

  //   const tree = schematicRunner.runSchematic('xplat', options, appTree);
  //   const files = tree.files;
  //   expect(files.indexOf('/xplat/web/index.ts')).toBeGreaterThanOrEqual(-1);
  //   expect(files.indexOf('/xplat/nativescript/index.ts')).toBeGreaterThanOrEqual(0);
  //   expect(files.indexOf('/xplat/ssr/index.ts')).toBeGreaterThanOrEqual(0);
  // });

  it('should create default xplat support for ionic which should always include web as well', () => {
    const options: XPlatOptions = { ...defaultOptions };
    options.platforms = 'ionic';

    const tree = schematicRunner.runSchematic('xplat', options, appTree);
    const files = tree.files;
    expect(files.indexOf('/xplat/web/index.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/xplat/ionic/index.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/xplat/nativescript/index.ts')).toBeGreaterThanOrEqual(-1);
  });

  it('should create additional xplat support when generated with different platforms', () => {
    const options: XPlatOptions = { ...defaultOptions };
    options.platforms = 'web,ionic';

    let tree = schematicRunner.runSchematic('xplat', options, appTree);
    let files = tree.files;
    expect(files.indexOf('/xplat/web/index.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/xplat/ionic/index.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/xplat/nativescript/index.ts')).toBeGreaterThanOrEqual(-1);
    expect(files.indexOf('/xplat/ssr/index.ts')).toBeGreaterThanOrEqual(-1);

    options.onlyIfNone = true;
    options.platforms = 'nativescript';
    tree = schematicRunner.runSchematic('xplat', options, tree);
    files = tree.files;
    // should be unchanged
    expect(files.indexOf('/xplat/web/index.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/xplat/ionic/index.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/xplat/nativescript/index.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/xplat/ssr/index.ts')).toBeGreaterThanOrEqual(-1);
  });

  it('should NOT create unsupported xplat option and throw', () => {
    const options: XPlatOptions = { ...defaultOptions };
    options.platforms = 'desktop';

    let tree: UnitTestTree | null = null;
    expect(() => tree = schematicRunner
      .runSchematic('xplat', options, appTree))
      .toThrowError(`desktop is not a supported platform. Currently supported: ${supportedPlatforms}`);
  });
}); 