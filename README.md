# Get Root Path - NodeJS
*   Stop counting dots - get the project root path with a single import
    *   (...or a single require if you're oldskool)
*   Memoizes the result for rapid lookups after initial run

## Basic usage

    import { rootPath } from '../get-root-path';

    path.join(rootPath, 'build/app/client');

*   if you set the APP_ROOT_PATH environment variable, it will return this as the root path
    instead


## Real-world usage (especially if transpiling in a large, complex project)
    import { rootPath } from '../get-root-path';

    const app = express()
        .use('/', express.static(path.join(rootPath, 'build/app/client')));


## What it _really_ does
*   No magic - it just finds the nearest parent (ancestor?) directory containing both a
    package.json file and a node_modules folder. 99% of the time this will be the project root of
    the file doing the lookup.
    *   If it ever gives you the wrong directory, definitely file an issue, I'd be more than
        happy to fix it
