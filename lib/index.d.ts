/**************************************************************************************************
 *
 *    Find the root path of the application i.e. the folder with a package.json file.
 *
 */
/***************************************** ERROR HANDLING *****************************************/
/**
 * Use when unable to resolve a path or find a file / directory
 */
export declare class PathfinderError extends Error {
    message: string;
    pathSeekerFile: string;
    pathSought: string;
    constructor(message: string, pathSeekerFile: string, pathSought: string);
}
/********************************************* MODULE *********************************************/
/**
 * Export the project root as-is
 */
export declare const rootPath: string;
export default rootPath;
/**
 * Find the project root.
 * If user set process.env.APP_ROOT_PATH, use that. If not found, traverse backwards from current
 * directory until a directory is found containing a package.json file.
 */
export declare function getRootPathSync(): string;
/**
 * Async version of getRootPath. Unneccessary, you should call getRootPathSync once on app
 * boot, memoize the result, and henceforth reference that. The project root isn't going to
 * change while running the app.
 */
export declare function getRootPathAsync(): any;
