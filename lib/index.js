"use strict";
/**************************************************************************************************
 *
 *    Find the root path of the application i.e. the folder with a package.json file.
 *
 */
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRootPathAsync = exports.getRootPathSync = exports.rootPath = exports.PathfinderError = void 0;
/************************************** THIRD-PARTY IMPORTS ***************************************/
const path = require("path");
const fs = require("fs");
const Promise = require("bluebird");
const madLogs = require("mad-logs");
const app_root_path_1 = require("app-root-path");
/**************************************** PROJECT IMPORTS *****************************************/
const TAG = madLogs.buildFileTag("get-root-path.ts");
const accessAsync = Promise.promisify(fs.access);
/***************************************** ERROR HANDLING *****************************************/
/**
 * Use when unable to resolve a path or find a file / directory
 */
class PathfinderError extends Error {
    constructor(message, pathSeekerFile, pathSought) {
        super(message);
        this.message = message;
        this.pathSeekerFile = pathSeekerFile;
        this.pathSought = pathSought;
        this.message =
            `${pathSeekerFile} could not find ${pathSought}` +
                (message ? ". message" : "");
        this.name = "PathError";
    }
}
exports.PathfinderError = PathfinderError;
/********************************************* MODULE *********************************************/
/**
 * Export the project root as-is
 */
exports.rootPath = (_b = (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.APP_ROOT_PATH) !== null && _b !== void 0 ? _b : app_root_path_1.path;
if (process.env.LOG_LEVEL === "silly") {
    console.log(`${TAG} project root path: `, exports.rootPath);
}
exports.default = exports.rootPath;
/**
 * Find the project root.
 * If user set process.env.APP_ROOT_PATH, use that. If not found, traverse backwards from current
 * directory until a directory is found containing a package.json file.
 */
function getRootPathSync() {
    if (process.env.APP_ROOT_PATH) {
        return process.env.APP_ROOT_PATH;
    }
    return (function getRoot(dir) {
        try {
            const isPkgJson = fs.accessSync(path.join(dir, "./package.json"));
        }
        catch (e) {
            throwIfAtFsRoot(dir);
            return getRoot(path.join(dir, ".."));
        }
        return dir;
    })(path.join(__dirname, "../.."));
}
exports.getRootPathSync = getRootPathSync;
/**
 * Async version of getRootPath. Unneccessary, you should call getRootPathSync once on app
 * boot, memoize the result, and henceforth reference that. The project root isn't going to
 * change while running the app.
 */
function getRootPathAsync() {
    if (process.env.APP_ROOT_PATH) {
        return Promise.resolve(process.env.APP_ROOT_PATH);
    }
    return (function getRoot(dir) {
        return accessAsync(path.join(dir, "./package.json"))
            .then(() => {
            console.log(`${TAG} Found root path: `, dir);
            return Promise.resolve(path.join(__dirname, ".."));
        })
            .catch((err) => {
            console.error(`${TAG} current path:`, dir);
            throwIfAtFsRoot(dir);
            return Promise.resolve(getRoot(path.join(dir, "..")));
        });
    })(path.join(__dirname, "..")).then((dir) => dir);
}
exports.getRootPathAsync = getRootPathAsync;
/**
 * Throws if we've reached the file system root without finding the project root
 * @param  {string} dir - current directory (in the traversal process)
 */
function throwIfAtFsRoot(dir) {
    if (dir === "/") {
        throw new PathfinderError("", __filename, "project root (package.json file location)");
    }
}
//# sourceMappingURL=index.js.map