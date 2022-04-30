# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.0.0](https://github.com/amediocredad/jal/compare/v2.0.0...v3.0.0) (2022-04-30)


### ⚠ BREAKING CHANGES

* Now does exact search, then match id, then loose contains.

### Features

* Now does exact search, then match id, then loose contains. ([37883fb](https://github.com/amediocredad/jal/commit/37883fbe333a6737d0c2d76028985d443157c2fe))


### Bug Fixes

* Fixes [#5](https://github.com/amediocredad/jal/issues/5) ([65ef123](https://github.com/amediocredad/jal/commit/65ef1237d11e21f7447a532ee0c51d67eb785239))

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
