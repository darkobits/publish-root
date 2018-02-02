/**
 * Name used to instantiate configstore instances.
 *
 * @type {string}
 */
export const CONFIG_NAME = 'publish-root';


/**
 * Temporary directory that project files will be moved into.
 *
 * @type {string}
 */
export const BACKUP_DIR = '.publish-root-backup';


/**
 * Directory which contains build artifacts.
 *
 * @type {string}
 */
export const OUT_DIR = process.argv[2] || 'dist';


/**
 * Directories to exclude when moving project files into the temporary backup
 * folder.
 *
 * @type {array}
 */
export const EXCLUDE_FROM_BACKUP = [
  'node_modules',
  BACKUP_DIR
];


/**
 * Fields in package.json that may contain paths to files which need to be
 * re-written.
 *
 * @type {array}
 */
export const REWRITE_FIELDS = [
  'bin',
  'directories',
  'main',
  'browser',
  'module',
  'man'
];


/**
 * List of additional files to copy to the output directory.
 *
 * See: https://docs.npmjs.com/files/package.json#files
 *
 * @type {array}
 */
export const COMMON_FILES = [
  'README',
  'CHANGES',
  'CHANGELOG',
  'HISTORY',
  'LICENSE',
  'LICENCE',
  'NOTICE'
];
