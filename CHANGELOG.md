# v3.0.1

-   [DOCS] Update README - remove unneeded descriptions

-   [CHORE] Upgrade default node.js version from 6 to 22
-   [CHORE] Upgrade Typescript version to 4.9.5

# v3.0.0

-   [BREAKING] Only checks for the presence of a package.json file to determine if a location is a root path
    -   node_modules folder is no longer required
    -   Accounts for:
        -   Projects with no dependencies;
        -   Newly pulled repositories; and
        -   Repositories that have just run a build step that (temporarily) removed node_modules (e.g. a "clean" step) 

-   [DOCS] Add CHANGELOG
-   [DOCS] Add installation instructions to README
-   [DOCS] Fix import instructions in README

-   [CHORE] Remove @types/lodash package
