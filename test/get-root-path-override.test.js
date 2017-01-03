// ensure environment knows testing is occurring
process.env.mocha = true;

const appRootPathFromEnvVar = process.env.APP_ROOT_PATH;
console.log(`appRootPathFromEnvVar: ${appRootPathFromEnvVar}`);

// Store original process.argv
const oldProcArgs = Object.assign({}, process.argv);

/************************************** THIRD-PARTY IMPORTS ***************************************/
const { expect } = require('chai');
const sinon = require('sinon');
const mocha = require('mocha');

const fs = require('fs');
const path = require('path');
const { stderr, stdout } = require('test-console');

/*********************************** IMPORT FILES TO BE TESTED ************************************/
const getRootPath = require('../lib/index');
const rootPath = getRootPath.rootPath;

/******************************************** HELPERS *********************************************/
/**
 * Prevents console.error messages emitted by code from reaching the console for given function
 * @param  {Function} fn - function to run without showing errors
 * @return {Object<{errorLogs: string[], warnLogs: string[], result: any}>} array containing
 *              warnings & errors outputted running the function, and the function result
 */
function blockErrorOutput(fn) {
    const errorLogs = [];
    const warnLogs = [];

    const errorOrig = console.error;
    console.error = (...msgs) => errorLogs.push(msgs);
    const warnOrig = console.warn;
    console.warn = (...msgs) => warnLogs.push(msgs);

    const result = fn();

    console.error = errorOrig;
    console.warn = warnOrig;

    return { errorLogs, warnLogs, result };
}

/********************************************* TESTS **********************************************/
describe('rootPath', function() {
    it('returns the value of environment variable APP_ROOT_PATH if it is defined', function() {
        console.log(`appRootPathFromEnvVar: ${appRootPathFromEnvVar}`);
        expect(rootPath).to.equal(appRootPathFromEnvVar);
    });
});

// Restore original process.argv
process.argv = Object.assign({}, oldProcArgs);
