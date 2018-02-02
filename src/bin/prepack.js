#!/usr/bin/env node

import {resolve, relative} from 'path';
import ConfigStore from 'configstore';
import {copy, ensureDir, move, readJson, writeJson} from 'fs-extra';
import {BACKUP_DIR, CONFIG_NAME, OUT_DIR, REWRITE_FIELDS} from '../etc/constants';
import {getBuildArtifactsToHoist, getCommonFilesToHoist, getFilesToBackUp} from '../lib/common';
import log from '../lib/log';


(async function () {
  const config = new ConfigStore(CONFIG_NAME);

  try {
    // ----- Prep --------------------------------------------------------------

    // Set start time.
    config.set('startTime', process.hrtime());

    log.verbose('', `Looking for build artifacts in "${OUT_DIR}".`);

    // Ensure build artifacts directory is not empty. Will throw if it is.
    await getBuildArtifactsToHoist();

    // Read package.json.
    const pkgJson = await readJson('package.json');

    // Create backup directory.
    await ensureDir(BACKUP_DIR);

    // Get a list of files to move.
    const filesToBackUp = await getFilesToBackUp();

    // Move files into backup directory.
    await Promise.all(filesToBackUp.map(file => move(file, resolve(BACKUP_DIR, file), {overwrite: true})));

    // Get a list of files to hoist from the backup directory.
    const filesToHoist = await Promise.all([
      ...(await getCommonFilesToHoist(BACKUP_DIR)),
      ...(await getBuildArtifactsToHoist(BACKUP_DIR))
    ]);

    // Hoist files.
    await Promise.all(filesToHoist.map(({from, to}) => copy(from, to, {preserveTimestamps: true})));

    // Rewrite fields in manifest to reflect new file paths.
    REWRITE_FIELDS.forEach(field => {
      if (!Reflect.has(pkgJson, field)) {
        return;
      }

      if (typeof pkgJson[field] === 'string') {
        // Re-write string fields.
        pkgJson[field] = relative(OUT_DIR, pkgJson[field]);
      } else if (Array.isArray(pkgJson[field])) {
        // Re-write array fields.
        pkgJson[field] = pkgJson[field].map(value => relative(OUT_DIR, value));
      } else if (typeof pkgJson[field] === 'object') {
        // Re-write object fields.
        Object.keys(pkgJson[field]).forEach(key => {
          pkgJson[field][key] = relative(OUT_DIR, pkgJson[field][key]);
        });
      }
    });

    // Set "files" field.
    pkgJson.files = filesToHoist.map(({to}) => to);

    // Log files to be included.
    pkgJson.files.forEach(file => {
      log.verbose('include', file);
    });

    // Write temporary manifest.
    await writeJson('package.json', pkgJson, {spaces: 2});
  } catch (err) {
    log.error('', err);
    process.exit(1);
  } finally {
    config.delete('startTime');
  }
})();
