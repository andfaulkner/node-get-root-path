# Get Root Path - NodeJS
*   Stop counting dots - get the project root path with a single import
    *   (...or a single require if you're oldskool)
*   Memoizes the result for rapid lookups after initial run

## What is the root path?
*   The nearest directory up the file system tree with a package.json file.

## Installation

    npm install --save get-root-path

## Basic usage

    import { rootPath } from 'get-root-path';

    path.join(rootPath, 'build/app/client');

*   If you set the APP_ROOT_PATH environment variable, it will return the
    value of APP_ROOT_PATH as the root path instead.


## Real-world usage

    import { rootPath } from 'get-root-path';

    const app = express()
        .use('/', express.static(path.join(rootPath, 'build/app/client')));


## What it does
*   No magic: it just finds the nearest parent (ancestor?) directory containing a package.json file
    *   99% of the time this will be the project root of the file doing the lookup.
