# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [4.2.2](https://github.com/amediocredad/jal/compare/v4.2.1...v4.2.2) (2024-05-12)

### Bug Fixes

-   '.' in slugs breaks html ([67432ff](https://github.com/amediocredad/jal/commit/67432ff0202dd9223b6ee54a760cb06ca8a23147)), closes [#14](https://github.com/amediocredad/jal/issues/14)

## [4.2.1](https://github.com/amediocredad/jal/compare/v4.2.0...v4.2.1) (2024-05-12)

### Bug Fixes

-   Iterate over toc without checking media type ([f1bf3a8](https://github.com/amediocredad/jal/commit/f1bf3a8293b3d2e0079c2662b3790cbfa2e2fd06)), closes [#12](https://github.com/amediocredad/jal/issues/12)
-   Update module.json ([bd90d34](https://github.com/amediocredad/jal/commit/bd90d345a8050fcd0a26db376b29ff8fa346640d))

## [4.2.0](https://github.com/amediocredad/jal/compare/v4.1.0...v4.2.0) (2023-05-29)

### Features

-   Use new section select menu to write to anchor flag ([46f70da](https://github.com/amediocredad/jal/commit/46f70da38a882e132f94a7c5ad6d9b43c9bfdff6))

## [4.1.0](https://github.com/amediocredad/jal/compare/v4.0.0...v4.1.0) (2022-10-17)

### Features

-   Add header as label in update dialog (Solves #8)

## [4.0.0](https://github.com/amediocredad/jal/compare/v3.0.2...v4.0.0) (2022-09-18)

### ⚠ BREAKING CHANGES

-   Only compatible with Foundry V10

-   Remove all foundry code, this now only adds anchor links on scene notes ([d08bac8](https://github.com/amediocredad/jal/commit/d08bac87ee71744316aaa14df1a2c9f085d6b303))

## [3.0.2](https://github.com/amediocredad/jal/compare/v3.0.1...v3.0.2) (2022-04-30)

## [3.0.1](https://github.com/amediocredad/jal/compare/v3.0.0...v3.0.1) (2022-04-30)

### Bug Fixes

-   Versioning ([78a3b52](#))

## [3.0.0](https://github.com/amediocredad/jal/compare/v2.0.0...v3.0.0) (2022-04-30)

### ⚠ BREAKING CHANGES

-   Now does exact search, then match id, then loose contains.

### Features

-   Now does exact search, then match id, then loose contains. ([37883fb](#))

### Bug Fixes

-   Fixes [#5](https://github.com/amediocredad/jal/issues/5) ([65ef123](#))

## 2.0.0 (2021-12-18)

-   Support for Foundry V9.

## 1.2.0 (2021-12-18)

-   Support for compendium links courtesy @Mgiepz.

## 1.1.0 (2021-08-12)

### Added

-   Support for scene notes following the same paradigm as the Journal Links.

### Fixed

-   Now properly checks if _header element_ exists or not.
-   No longer displaying a ui notification when a _header_ is not found. Instead logs a warning in console for easier debugging.

## 1.0.2 (2021-08-10)

### Fixed

-   CSS rule on body to fix it on screen. This allows the use of `scrollIntoView()` again.
-   Reverted to `scrollIntoView()` setting behaviour to smooth.
-   Setting a custom name for a link will now be respected by the module.

## 1.0.1 (2021-08-09)

### Added

-   Animation to scroll

### Fixed

-   Bug where canvas would be scrolled as well

## 1.0.0 (2021-08-09)

> Initial Commit and Release

### Added

-   Libary
-   Module files
