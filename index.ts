/**************************************************************************************************
*
*    Current environments: server and build
*
*    Find the root path of the application i.e. the folder with package.json.
*
*/

/************************************** THIRD-PARTY IMPORTS ***************************************/
import * as path from 'path';
import * as fs from 'fs';
import * as Promise from 'bluebird';
import * as madLogs from 'mad-logs';
import { rootPath as appRootPath } from 'app-root-path';

/**************************************** PROJECT IMPORTS *****************************************/
const TAG = madLogs.buildFileTag('get-root-path.ts');

const accessAsync = Promise.promisify(fs.access);

/***************************************** ERROR HANDLING *****************************************/
/**
 * Use when unable to resolve a path or find a file / directory
 */
export class PathfinderError extends Error {
    constructor(
        public message: string,
        public pathSeekerFile: string,
        public pathSought: string
    ) {
        super(message);
        this.message = `${pathSeekerFile} could not find ${pathSought}` +
                       (message ? '. message' : '');
        this.name = 'PathError';
    }
}

/********************************************* MODULE *********************************************/
/**
 * Export the project root as-is
 */
export const rootPath: string = (process.env.APP_ROOT_PATH
                                    ? process.env.APP_ROOT_PATH
                                    : appRootPath);

if (process.env.LOG_LEVEL === 'silly') {
    console.log(`${TAG} project root path: `, rootPath);
}

/**
 * Find the project root.
 * If user set process.env.APP_ROOT_PATH, use that. If not found, traverse backwards from current
 * directory until a directory is found containing both node_modules and package.json.
 */
export function getRootPathSync(): string {
    if (process.env.APP_ROOT_PATH) {
        return process.env.APP_ROOT_PATH;
    }
    return (function getRoot(dir: string) {
        try {
            const isPkgJson = fs.accessSync(path.join(dir, './package.json'));
            const is_node_modules = fs.accessSync(path.join(dir, './node_modules'));
        } catch (e) {
            throwIfAtFsRoot(dir);
            return getRoot(path.join(dir, '..'));
        }
        return dir;
    }(path.join(__dirname, '../..')));
}

/**
 * Async version of getRootPath. Unneccessary, you should call getRootPathSync once on app
 * boot, memoize the result, and henceforth reference that. The project root isn't going to
 * change while running the app.
 */
export function getRootPathAsync() {
    if (process.env.APP_ROOT_PATH) {
        return Promise.resolve(process.env.APP_ROOT_PATH);
    }
    return (function getRoot(dir: string) {
        return accessAsync(path.join(dir, './package.json'))
            .then(() => accessAsync(path.join(dir, './node_modules')))
            .then(() => {
                console.log(`${TAG} Found root path: `, dir);
                return Promise.resolve(path.join(__dirname, '..'));
            })
            .catch((err: Error) => {
                console.error(`${TAG} current path:`, dir);
                throwIfAtFsRoot(dir);
                return Promise.resolve(getRoot(path.join(dir, '..')));
            });
    }(path.join(__dirname, '..'))).then((dir) => dir);
}

/**
 * Throws if we've reached the file system root without finding the project root
 * @param  {string} dir - current directory (in the traversal process)
 */
function throwIfAtFsRoot(dir: string): never | void {
    if (dir === '/') {
        throw new PathfinderError(
            '', __filename, 'project root (package.json & node_modules location)'
        );
    } 
}
