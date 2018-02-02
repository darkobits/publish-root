#!/usr/bin/env node

import ConfigStore from 'configstore';
import convertHrtime from 'convert-hrtime';
import {copy, remove} from 'fs-extra';
import {BACKUP_DIR, CONFIG_NAME} from '../etc/constants';
import {getBuildArtifactsToHoist, getCommonFilesToHoist} from '../lib/common';
import log from '../lib/log';


(async function () {
  const config = new ConfigStore(CONFIG_NAME);

  try {
    const filesToDelete = (await Promise.all([
      ...(await getCommonFilesToHoist(BACKUP_DIR)),
      ...(await getBuildArtifactsToHoist(BACKUP_DIR))
    ])).map(({to}) => to);

    // Remove all hoisted files.
    await Promise.all(filesToDelete.map(file => remove(file)));

    // Restore backed-up files.
    await copy(BACKUP_DIR, '.');

    // Remove backup directory.
    await remove(BACKUP_DIR);

    // Log timing info.
    const startTime = config.get('startTime');

    if (startTime) {
      const endTime = Math.floor(convertHrtime(process.hrtime(startTime)).milliseconds);
      log.info('pack', `Done in ${endTime}ms.`);
    }

    log.verbose('restore', 'Restore complete.');
  } catch (err) {
    log.error('', err);
    process.exit(1);
  } finally {
    config.delete('startTime');
  }
})();
