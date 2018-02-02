import {promisify} from 'util';
import glob from 'glob';

export default promisify(glob);
