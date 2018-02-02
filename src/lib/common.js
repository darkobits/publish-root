import {relative, sep} from 'path';
import {EXCLUDE_FROM_BACKUP, OUT_DIR, COMMON_FILES} from '../etc/constants';
import glob from './glob';
import log from './log';


/**
 * Returns a list of all files/folders that should be temporarily moved into
 * the backup directory.
 *
 * @return {Promise<Array>}
 */
export async function getFilesToBackUp () {
  return glob(`!(${EXCLUDE_FROM_BACKUP.join('|')})`);
}


/**
 * Returns a list of all build artifacts that should be included in the tarball.
 *
 * @param  {string} subDir
 * @return {promise<array>}
 */
export async function getBuildArtifactsToHoist (subDir) {
  const pattern = [subDir, OUT_DIR, '**', '*.*'].filter(v => v).join(sep);

  const results = (await glob(pattern)).map(file => ({
    from: file,
    to: relative(`${subDir ? subDir + sep : ''}${OUT_DIR}`, file)
  }));

  if (results.length === 0) {
    throw new Error(`No build artifacts found in "${OUT_DIR}"!`);
  }

  log.silly('getBuildArtifactsToHoist', results);

  return results;
}


/**
 * Returns a list of all common files that should be included in the tarball.
 *
 * See: https://docs.npmjs.com/files/package.json#files
 *
 * @param  {string} subDir
 * @return {promise<array>}
 */
export async function getCommonFilesToHoist (subDir) {
  const pattern = [subDir && subDir + sep, '{' + COMMON_FILES.join(',') + '}', '*'].filter(v => v).join('');

  const results = (await glob(pattern)).map(file => ({
    from: file,
    to: relative(`${subDir ? subDir + sep : ''}`, file)
  }));

  log.silly('getCommonFilesToHoist', results);

  return results;
}
