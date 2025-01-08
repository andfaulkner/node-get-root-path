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
